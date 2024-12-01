import { randomUUID, UUID } from "crypto";
import Item from "./Item";
import { ReceiptDatabase } from "./database"
import { z } from "zod";

export default class Receipt {

    private id: UUID
    private points: number
    private retailer: string
    private purchaseDate: string
    private purchaseTime: string
    private items: Item[]
    private total: number

    constructor(receipt) {
        this.id = randomUUID()
        this.retailer = receipt.retailer
        this.purchaseDate = receipt.purchaseDate
        this.purchaseTime = receipt.purchaseTime
        this.items = receipt.items.map((item) => new Item(item.shortDescription, item.price))
        this.total = parseFloat(receipt.total)
        this.points = this.calculatePoints()

        this.saveReceipt()
    }

    async saveReceipt() {
        const db = ReceiptDatabase.getDb()
        await db.insertReceipt(this);
    }

    getId() {
        return this.id
    }

    getPoints() {
        return this.points
    }

    calculatePoints(): number {
        const retailerPoints = this.calculateRetailerPoints(this.retailer)
        const totalsPoints = this.calculateTotalsPoints(this.total)
        const itemPoints = this.calculateItemPoints(this.items)
        const dateTimePoints = this.calculateDateTimePoints(this.purchaseDate, this.purchaseTime)
        return retailerPoints + totalsPoints + itemPoints + dateTimePoints
    }

    private calculateRetailerPoints(retailer: string): number {
        return retailer.replace(/[^a-zA-Z0-9]/g, "").length
    }

    private calculateTotalsPoints(total: number): number {
        return (total % 1 === 0 ? 50 : 0) + (total % .25 === 0 ? 25 : 0)
    }

    private calculateItemPoints(items: Item[]): number {
        const numItemPoints = Math.floor(items.length / 2) * 5
        const itemDescPoints = items.reduce((sum, current) => {
            if (current.getShortDescription().trim().length % 3 === 0) {
                return sum + Math.ceil(current.getPrice() * 0.2)
            } else {
                return sum
            }
        }, 0)

        return numItemPoints + itemDescPoints
    }

    private calculateDateTimePoints(date, time): number {
        const formattedDate = new Date(`${date}T00:00:00`)
        const datePoints = formattedDate.getDate() % 2 != 0 ? 6 : 0
        const formattedTime = new Date(`2007-08-25T${time}:00`)
        const startTimeRange = new Date('2007-08-25T14:00:00')
        const endTimeRange = new Date('2007-08-25T16:00:00')
        const isTimePointable = (formattedTime >= startTimeRange && formattedTime <= endTimeRange);
        const timePoints = isTimePointable ? 10 : 0;

        return datePoints + timePoints
    }

}

export const ReceiptSchema = z.object({
    retailer: z.string().min(1),
    purchaseDate: z.string().min(1),
    purchaseTime: z.string().min(4),
    items: z.object({
        shortDescription: z.string().min(1),
        price: z.string().min(4)
    }).array().min(1),
    total: z.string().min(4)
})
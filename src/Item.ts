
export default class Item {
    public shortDescription: string
    public price: number

    constructor(shortDescription: string, price: number) {
        this.shortDescription = shortDescription
        this.price = price
    }

    getShortDescription() {
        return this.shortDescription
    }

    getPrice() {
        return this.price
    }
}
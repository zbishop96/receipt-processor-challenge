import { type UUID } from 'crypto'
import Receipt from './Receipt'

export class ReceiptDatabase {
  private static db: ReceiptDatabase
  private receipts: Map<UUID, Receipt> = new Map<UUID, Receipt>()

  private constructor () { }

  public static getDb (): ReceiptDatabase {
    if (this.db === undefined) {
      this.db = new ReceiptDatabase()
    }
    return this.db
  }

  public async insertReceipt (receipt: Receipt): Promise<void> {
    this.receipts.set(receipt.getId(), receipt)
  }

  public async deleteReceipt (id: UUID): Promise<void> {
    this.receipts.delete(id)
  }

  public async getReceipt (id: UUID): Promise<Receipt | undefined> {
    return this.receipts.get(id)
  }

  public async dropDatabase (): Promise<void> {
    this.receipts = new Map<UUID, Receipt>()
  }
}

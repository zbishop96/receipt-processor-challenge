import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { ReceiptDatabase } from '../database';
import Receipt from '../Receipt';

@Injectable()
export class ReceiptsService {
  submitReceipt(receipt): UUID {
    const createdReceipt = new Receipt(receipt)
    return createdReceipt.getId();
  }

  async getReceipt(id: UUID): Promise<{points: number} | undefined> {
    const db = ReceiptDatabase.getDb();
    const receipt = await db.getReceipt(id)
    return receipt ? { points: receipt.getPoints() } : undefined;
  }
}

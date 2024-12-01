import { Controller, Get, Post, Param, Req, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ReceiptsService } from './receipts.service';
import { ReceiptSchema } from '../Receipt';
import { UUID } from 'crypto';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get(':id/points')
  async getReceiptPoints(@Param('id') id: UUID, @Res({ passthrough: true }) res: Response): Promise<{points: number} | {id: UUID}> {
    const result = await this.receiptsService.getReceipt(id);
    if (!result) {
        res.status(HttpStatus.NOT_FOUND)
        return {id: id}
    } else {
        return result
    }
  }

  @Post('process')
  submitReceipt(@Req() request: Request, @Res({ passthrough: true }) res: Response): {id: UUID} | {receipt: any, error: string} {
    const isValid = ReceiptSchema.safeParse(request.body)
    if (!isValid.success) {
        res.status(HttpStatus.BAD_REQUEST)
        return {receipt: request.body, error: isValid.error.message}
    } else {
        return { id: this.receiptsService.submitReceipt(request.body)};
    }
  }
}

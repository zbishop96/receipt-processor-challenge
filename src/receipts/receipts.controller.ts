import { Controller, Get, Post, Param, Req, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ReceiptsService } from './receipts.service';
import { ReceiptSchema } from 'src/Receipt';
import { UUID } from 'crypto';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get(':id/points')
  async findOne(@Param('id') id: UUID, @Res({ passthrough: true }) res: Response): Promise<{points: number} | {id: UUID}> {
    const result = await this.receiptsService.getReceipt(id); 
    if (!result) {
        res.status(HttpStatus.NOT_FOUND)
        return {id: id}
    } else {
        return result
    }
  }

  @Post('process')
  submitReceipt(@Req() request: Request, @Res({ passthrough: true }) res: Response): {id: UUID} | string {
    console.log(request.body)
    const isValid = ReceiptSchema.safeParse(request.body)
    if (!isValid.success) {
        res.status(HttpStatus.BAD_REQUEST)
        return isValid.error.message
    } else {
        return { id: this.receiptsService.submitReceipt(request.body)};
    }
  }
}

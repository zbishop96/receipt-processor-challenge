import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts/receipts.service';
import { ReceiptsController } from './receipts/receipts.controller';

@Module({
  imports: [],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
})
export class AppModule {}

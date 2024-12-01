import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiptsService } from './receipts/receipts.service';
import { ReceiptsController } from './receipts/receipts.controller';

@Module({
  imports: [],
  controllers: [AppController, ReceiptsController],
  providers: [AppService, ReceiptsService],
})
export class AppModule {}

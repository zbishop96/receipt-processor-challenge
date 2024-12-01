import { UUID } from 'crypto';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { receiptMissingRetailer, validTargetReceipt } from './receiptTestData'

describe('ReceiptsController', () => {
  let receiptsService: ReceiptsService;
  let receiptsController: ReceiptsController;

  beforeEach(() => {
    receiptsService = new ReceiptsService();
    receiptsController = new ReceiptsController(receiptsService);
  });

  describe('submitReceipt', () => {

    const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    it('should reject a receipt an invalid schema', async () => {
        const mockRequest: any = {
          body: receiptMissingRetailer,
        };

        expect(await receiptsController.submitReceipt(mockRequest, mockResponse)).toHaveProperty('error');
    });

    it('should accept a valid receipt', async () => {
      const mockRequest: any = {
        body: validTargetReceipt,
      };

      const res = await receiptsController.submitReceipt(mockRequest, mockResponse);
      expect(res).toHaveProperty('id')
    });
  });

  describe('getReceiptPoints', () => {

    const mockResponse: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    it('should return a 404 if the provided ID does not exist', async () => {
      expect(await receiptsController.getReceiptPoints('9e71a89b-923d-402f-a720-2fb860d9cd9c', mockResponse)).toHaveProperty('id')
    })

    it('return the points of a receipt', async () => {
      const mockRequest: any = {
        body: validTargetReceipt,
      };
      const createdId = await receiptsController.submitReceipt(mockRequest, mockResponse);
      if ('error' in createdId) {
        throw new Error('failed to create valid receipt in test.')
      } else {
        const result = await receiptsController.getReceiptPoints(createdId.id, mockResponse);
        expect(result).toHaveProperty('points')
        if ('points' in result) {
          expect(result.points).toBe(28)
        }

      }      
    })
  })
});

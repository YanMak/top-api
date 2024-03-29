import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';

describe('reviewService', () => {
  let service: ReviewService;

  const exec = { exec: jest.fn() };
  const reviewRepositoryFactory = () => ({
    find: () => exec,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          useFactory: reviewRepositoryFactory,
          provide: getModelToken('ReviewModel'),
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined ', () => {
    expect(service).toBeDefined();
  });

  it('findByProductId working', async () => {
    const id = new Types.ObjectId().toHexString();
    console.log(id);
    reviewRepositoryFactory()
      .find()
      .exec.mockReturnValueOnce([{ product: id }]);
    const res = await service.findByProductId(id);
    console.log('res');
    console.log(res);
    expect(res[0].product).toBe(id);
  });
});

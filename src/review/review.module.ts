import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModel, ReviewModelSchema } from './models/review.model';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewModel.name, schema: ReviewModelSchema },
    ]),
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}

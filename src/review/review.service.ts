import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReviewModel } from './models/review.model';
import { CreateReviewDto } from './dtos/create-review.dto';

//class Leak {}
//const leaks = [];

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel.name)
    private readonly reviewModel: Model<ReviewModel>,
  ) {}

  async create(dto: CreateReviewDto) {
    return this.reviewModel.create({ ...dto, product: dto.productId });
  }

  async delete(id: string) {
    console.log('delete id=' + id);
    const res = await this.reviewModel.findByIdAndDelete(id).exec();
    console.log(res);
    return res;
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel
      .findOneAndDelete({
        product: new Types.ObjectId(productId),
      })
      .exec();
  }

  async findByProductId(productId: string): Promise<ReviewModel[]> {
    //console.log(`findByProductId(productId: ${productId} string)`);
    //const res = await this.reviewModel.findOne({
    //  product: new Types.ObjectId(productId),
    //});
    //console.log(res);
    //leaks.push(new Leak());
    return this.reviewModel
      .find({ product: new Types.ObjectId(productId) })
      .exec();
  }

  async reviewsOfProducts(productId: string) {
    return this.reviewModel
      .aggregate([
        { $sort: { _id: 1 } },
        {
          $lookup: {
            from: 'productmodels',
            localField: 'product',
            foreignField: '_id',
            as: 'products',
          },
        },
      ])
      .exec();
  }
}

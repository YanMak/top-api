import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductModel } from './models/product.model';
import { CreateProductDto } from './dtos/create-product.dto';
import { FindProductDto } from './dtos/find-product.dto';
import { ReviewModel } from 'src/review/models/review.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel.name)
    private readonly productModel: Model<ProductModel>,
  ) {}

  async create(dto: CreateProductDto) {
    return await this.productModel.create(dto);
  }

  async findById(id: string) {
    return this.productModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findByReviews(dto: FindProductDto) {
    /*return (await this.productModel
      .aggregate([
        { $match: { categories: dto.category } },
        { $sort: { _id: 1 } },
        { $limit: dto.limit },
        {
          $lookup: {
            from: 'reviewmodels',
            localField: '_id',
            foreignField: 'product',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
            reviews: {
              $function: {
                body: `function (reviews) {
                  reviews.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                  );
                  return reviews;
                }`,
                args: ['$reviews'],
                lang: 'js',
              },
            },
          },
        },
      ])
      .exec()) as (ProductModel & {
      review: ReviewModel;
      reviewCount: number;
      reviewAvg: number;
    })[];*/

    return (await this.productModel
      .aggregate([
        { $match: { categories: dto.category } },
        { $sort: { _id: 1 } },
        { $limit: dto.limit },
        {
          $lookup: {
            from: 'reviewmodels',
            localField: '_id',
            foreignField: 'product',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
            reviews: {
              $function: {
                body: `function (reviews) {
                  reviews.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                  );
                  return reviews;
                }`,
                args: ['$reviews'],
                lang: 'js',
              },
            },
          },
        },
      ])
      .exec()) as (ProductModel & {
      review: ReviewModel;
      reviewCount: number;
      reviewAvg: number;
    })[];
  }
}

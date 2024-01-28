import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopPageModel } from './models/top-page.model';
import { CreateTopPageDto } from './dtos/create-top-page.dto';
import { Model, Types } from 'mongoose';
import { FindTopPageDto } from './dtos/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel.name)
    private readonly topPageModel: Model<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(new Types.ObjectId(id)).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async update(id: string, dto: CreateTopPageDto) {
    return this.topPageModel
      .findByIdAndUpdate(new Types.ObjectId(id), dto)
      .exec();
  }

  async delete(id: string) {
    return this.topPageModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async findByCategory(dto: FindTopPageDto) {
    console.log(dto);
    /*return this.topPageModel
      .find(
        { firstLevelCategory: dto.firstLevelCategory },
        { alias: 1, secondCategory: 1, title: 1 },
      )
      .exec();*/
    return this.topPageModel
      .aggregate([
        { $match: { firstLevelCategory: dto.firstLevelCategory } },
        { $sort: { _id: 1 } },
        {
          $group: {
            _id: { secondCategory: '$secondCategory' },
            pages: { $push: { alias: '$alias', title: '$title' } },
          },
        },
      ])
      .exec() as Promise<TopPageModel[]>;
  }

  async findByText(text: string) {
    return this.topPageModel
      .find({
        $text: { $search: text, $caseSensitive: false },
      })
      .exec();
  }
}

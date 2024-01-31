import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopPageModel } from './models/top-page.model';
import { CreateTopPageDto } from './dtos/create-top-page.dto';
import { Model, Types } from 'mongoose';
import { FindTopPageDto } from './dtos/find-top-page.dto';
import TopPageSearchService from './search/top-page-search.service';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel.name)
    private readonly topPageModel: Model<TopPageModel>,
    private readonly topPageSearchService: TopPageSearchService,
  ) {}

  async create(dto: CreateTopPageDto) {
    const doc = await this.topPageModel.create(dto);

    const savedSearch = await this.topPageSearchService.indexTopPage(doc);
    console.log(savedSearch);
    return doc;
  }

  async searchForPosts(text: string) {
    const results = await this.topPageSearchService.search(text);
    console.log(results);
    return results;
    /*const ids = results.map((result) => result.hits.hits.id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepository.find({
      where: { id: In(ids) },
    });*/
  }

  async findById(id: string) {
    return this.topPageModel.findById(new Types.ObjectId(id)).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async update(id: string, dto: CreateTopPageDto) {
    const doc = await this.topPageModel
      .findByIdAndUpdate(new Types.ObjectId(id), dto)
      .exec();

    const elasticDoc = await this.topPageSearchService.update(doc);
    console.log(elasticDoc);

    return doc;
  }

  async delete(id: string) {
    const doc = this.topPageModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
    await this.topPageSearchService.remove(id);
    return doc;
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

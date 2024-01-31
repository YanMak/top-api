import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { TopPageService } from './top-page.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageModel, TopPageModelSchema } from './models/top-page.model';
import TopPageSearchService from './search/top-page-search.service';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TopPageModel.name, schema: TopPageModelSchema },
      ,
    ]),
    SearchModule,
  ],
  controllers: [TopPageController],
  providers: [TopPageService, TopPageSearchService],
})
export class TopPageModule {}

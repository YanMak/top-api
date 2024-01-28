import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { TopPageService } from './top-page.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageModel, TopPageModelSchema } from './models/top-page.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TopPageModel.name, schema: TopPageModelSchema },
    ]),
  ],
  controllers: [TopPageController],
  providers: [TopPageService],
})
export class TopPageModule {}

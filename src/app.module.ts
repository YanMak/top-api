import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ContentProviderModule } from './content-provider/content-provider.module';
import { AuthModule } from './auth/auth.module';
import { TopPageModule } from './top-page/top-page.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo/mongo.config';
import { SearchModule } from './search/search.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { LoyaltyModule } from './loyalty/loyalty.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    ConfigModule.forRoot({ envFilePath: 'envs/.account.env', isGlobal: true }),
    AuthModule,
    TopPageModule,
    ProductModule,
    ReviewModule,
    ContentProviderModule,
    MongooseModule.forRootAsync(getMongoConfig()),
    SearchModule,
    SitemapModule,
    LoyaltyModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

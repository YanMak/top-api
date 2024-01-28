import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModel, ProductModelSchema } from './models/product.model';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductModel.name, schema: ProductModelSchema }])],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule { }

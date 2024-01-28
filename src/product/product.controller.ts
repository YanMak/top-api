import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindProductDto } from './dtos/find-product.dto';
import { ProductModel } from './models/product.model';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductService } from './product.service';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND_ERROR');
    }
    return product;
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const product = await this.productService.deleteById(id);
    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND_ERROR');
    }
    return product;
  }

  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ProductModel,
  ) {
    const product = await this.productService.updateById(id, dto);
    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND_ERROR');
    }
    return product;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this.productService.findByReviews(dto);
  }
}
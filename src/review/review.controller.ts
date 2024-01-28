import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dtos/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log('async delete(@Param() id: string) { id = ' + id);
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    } else {
      return deletedDoc;
    }
  }

  @Delete('byProduct/:productId')
  async deleteByProduct(@Param('productId') productId: string) {
    const deletedDoc = await this.reviewService.deleteByProductId(productId);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    } else {
      return deletedDoc;
    }
  }

  @Post('reviewsOfProducts/:productId')
  async reviewsOfProducts(@Param('productId') productId: string) {
    const deletedDoc = await this.reviewService.reviewsOfProducts(productId);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    } else {
      return deletedDoc;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId') productId: string,
    @UserEmail() email: string,
  ) {
    //console.log('async getByProduct(');
    //console.log(email);
    return this.reviewService.findByProductId(productId);
  }
}

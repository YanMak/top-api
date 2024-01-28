import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';
import { ProductModel } from '../../product/models/product.model';

@Schema()
export class ReviewModel extends Document {
  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  rating: number;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: MSchema.Types.ObjectId, ref: ProductModel.name })
  product: ProductModel;
}

export const ReviewModelSchema = SchemaFactory.createForClass(ReviewModel);

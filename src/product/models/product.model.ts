import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class ProductCharacterisctic extends Document {
  @Prop()
  name: string;
  @Prop()
  value: string;
}

@Schema()
export class ProductModel extends Document {
  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice: number;

  @Prop()
  credit: number;

  @Prop()
  calculatedRating: number;

  @Prop()
  description: string;

  @Prop()
  advantages: string;

  @Prop()
  disAdvantages: string;

  @Prop({ type: () => [String] })
  categories: string[];

  @Prop({ type: () => [String] })
  tags: string[];

  @Prop({ type: () => [ProductCharacterisctic], _id: false })
  characteristics: ProductCharacterisctic[];
}
export const ProductModelSchema = SchemaFactory.createForClass(ProductModel);

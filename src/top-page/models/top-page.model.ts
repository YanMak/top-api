import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

@Schema()
export class hhSalaries extends Document {
  @Prop()
  count: number;

  @Prop()
  juniorSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  seniorSalary: number;
}

@Schema()
export class Advantages extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

@Schema()
export class TopPageModel extends Document {
  //@Prop()
  //_id?: string;

  @Prop({ type: () => TopLevelCategory })
  firstLevelCategory: TopLevelCategory;

  @Prop()
  secondCategory: string;

  @Prop()
  title: string;

  @Prop({ unique: true })
  alias: string;

  @Prop()
  category: string;

  @Prop()
  hh?: hhSalaries;

  @Prop({ type: () => [Advantages] })
  advantages: Advantages[];

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop({ type: () => [String] })
  tags: string[];

  @Prop()
  updatedAt: Date;
}

export const TopPageModelSchema = SchemaFactory.createForClass(TopPageModel);
TopPageModelSchema.index({
  title: 'text',
  seoText: 'text',
});

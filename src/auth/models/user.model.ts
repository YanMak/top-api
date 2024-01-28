import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserModel extends Document {
  @Prop()
  email: string;

  @Prop()
  passwordHash: string;
}
export const UserModelSchema = SchemaFactory.createForClass(UserModel);

import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../models/top-page.model';
import { Type } from 'class-transformer';

export class hhSalariesDto {
  @IsNumber()
  count: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

export class AdvantagesDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateTopPageDto {
  @IsEnum(TopLevelCategory)
  firstLevelCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  title: string;

  @IsString()
  alias: string;

  @IsString()
  category: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => hhSalariesDto)
  hh?: hhSalariesDto;

  @IsArray()
  @ValidateNested()
  @Type(() => AdvantagesDto)
  advantages: AdvantagesDto[];

  @IsString()
  seoText: string;

  @IsString()
  tagsTitle: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

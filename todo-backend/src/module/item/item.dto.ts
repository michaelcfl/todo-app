import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateItemDTO {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateItemDTO extends PartialType(CreateItemDTO) {
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}

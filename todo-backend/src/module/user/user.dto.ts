import { IsString, IsUUID } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;
}

export class UpdateUserDTO {
  @IsUUID()
  uuid: string;

  @IsString()
  name: string;
}

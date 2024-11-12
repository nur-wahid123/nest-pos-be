import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsAlphanumeric,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric(null, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  username: string;

  @IsInt()
  age: number;

  @IsString()
  @IsEnum(Gender)
  gender: Gender;
}

import { Expose } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CobaDto {
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @Expose({ name: 'name' })
  name!: string;
}

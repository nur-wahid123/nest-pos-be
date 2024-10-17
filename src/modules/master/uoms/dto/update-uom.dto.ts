import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUomDto } from './create-uom.dto';
import { Expose } from 'class-transformer';

export class UpdateUomDto extends CreateUomDto {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'before_name' })
  beforeName: string;
}

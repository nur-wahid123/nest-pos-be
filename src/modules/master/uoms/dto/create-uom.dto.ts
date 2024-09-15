import { IsNotEmpty, IsString } from "class-validator";

export class CreateUomDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

}

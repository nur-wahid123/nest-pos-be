import { CreateUomInput } from './create-uom.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

export class UpdateUomInput extends PartialType(CreateUomInput) {
  id: number;
}

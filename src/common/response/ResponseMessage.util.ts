import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResponseMessage {
    @Field()
    msg: string;

    constructor(msg: string) {
        this.msg = msg
    }
}
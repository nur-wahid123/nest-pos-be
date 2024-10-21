import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(
        createUserDto: CreateUserDto,
        userId?: number,
    ): Promise<User> {
        const ett = this.dataSource.createEntityManager();
        const user = ett.create(User, {
            ...createUserDto,
            createdBy: userId,
        });

        return await ett.save(user);
    }
}
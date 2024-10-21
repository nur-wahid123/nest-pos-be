import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(
        user: User
    ): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
        try {
            await queryRunner.startTransaction()
            await queryRunner.manager.save(user)
            await queryRunner.commitTransaction()
            return user
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.log(error);
            console.log('user-r');
            throw new InternalServerErrorException()
        } finally {
            await queryRunner.release()
        }
    }
}
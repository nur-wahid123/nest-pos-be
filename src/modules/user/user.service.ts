import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSalt, hash } from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { ResponseMessage } from 'src/common/response/ResponseMessage.util';
import { UserRepository } from 'src/repositories/user.repository';
import HashPassword from 'src/common/utils/hash-password.util';

@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashPassword: HashPassword,
  ) { }

  async init() {
    const user = new User();
    user.username = 'superadmin';
    user.name = 'super admin';
    user.password = await this.hashPassword.generate('password12345');
    const username = await this.userRepository.findOneBy({ username: user.username });
    if (username === null) {
      await this.userRepository.createUser(user);
    }
    console.log('superadmin created!!');
  }

  async isUsernameAndEmailExist(
    username: string,
    email: string,
  ): Promise<boolean> {
    const isUsernameExists = await this.isUsernameExists(username);
    if (isUsernameExists) {
      throw new ForbiddenException(['Username already in used2']);
    }
    const isEmailExists = await this.isEmailExists(email);
    if (isEmailExists) {
      throw new BadRequestException(['Email already in used']);
    }
    if (isEmailExists && isUsernameExists) return true;
    return false;
  }

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {

      const user: User = new User();
      user.name = createUserDto.name;
      user.age = createUserDto.age;
      if (await this.isUsernameExists(createUserDto.username)) {
        throw new BadRequestException('Username Sudah digunakan');
      }
      user.username = createUserDto.username;
      if (await this.isEmailExists(createUserDto.email)) {
        throw new BadRequestException('Email Sudah digunakan');
      }
      user.email = createUserDto.email;
      const salt = await genSalt(10);
      user.password = await hash(createUserDto.password, salt);
      user.gender = createUserDto.gender;
      return this.userRepository.createUser(user);
    } catch (error) {
      console.log('user-s');

    }
  }

  async isUsernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ username });
    console.log(user);

    return user != null ? true : false;
  }

  async isEmailExists(email: string): Promise<boolean> {
    return (await this.userRepository.findOneBy({ email })) != null
      ? true
      : false;
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.gender', 'user.username', 'user.age', 'user.email', 'user.password'])
      .where('user.username = :username', { username })
      .getOne();
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  viewUser(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return new ResponseMessage('Okay')
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}

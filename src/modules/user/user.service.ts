import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSalt, hash } from 'bcrypt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  async isUsernameAndEmailExist(
    username: string,
    email: string,
  ): Promise<boolean> {
    const isUsernameExists = await this.isUsernameExists(username);
    if (isUsernameExists) {
      throw new BadRequestException('Username already in used2');
    }
    const isEmailExists = await this.isEmailExists(email);
    if (isEmailExists) {
      throw new BadRequestException('Email already in used');
    }
    if (isEmailExists && isUsernameExists) return true;
    return false;
  }
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.name = createUserDto.name;
    user.age = createUserDto.age;
    if (await this.isUsernameExists(createUserDto.username)) {
      throw new Error('Username Sudah digunakan');
    }
    user.username = createUserDto.username;
    if (await this.isEmailExists(createUserDto.email)) {
      throw new Error('Email Sudah digunakan');
    }
    user.email = createUserDto.email;
    const salt = await genSalt(10);
    user.password = await hash(createUserDto.password, salt);
    user.gender = createUserDto.gender;
    return this.userRepository.save(user);
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
    return this.userRepository.findOneBy({ username });
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
  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.name = updateUserDto.name;
    user.age = updateUserDto.age;
    user.email = updateUserDto.email;
    user.username = updateUserDto.username;
    user.password = updateUserDto.password;
    user.id = id;
    return this.userRepository.save(user);
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

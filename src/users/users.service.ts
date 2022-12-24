import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<object> {
    return await this.usersRepository.save(createUserDto)
      .then(resultCreate=>{
        if (resultCreate) {
          return {
            statusCode: 200,
            message: "success",
            data: [resultCreate]
          }  
        }
      }) 
      .catch(err=>{
        throw new HttpException(err.detail ? err.detail : "Failed to create user", HttpStatus.NOT_FOUND);
      })
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async getUsersByFilters(query:FilterUserDto): Promise<object> {
    try{
      let builder = this.usersRepository.createQueryBuilder("users")   
      if (query.name !== '' && query.email !== '') {
        builder.where('name LIKE :name AND email LIKE :email',{name: query.name,email: query.email}).skip((query.page -1) * query.limit).take(query.limit)
        return {
          statusCode: 200,
          message: "success",
          data: await builder.getMany()
        }  
      }
      if (query.email !== '') {
        builder.where('email LIKE :email',{email: query.email}).skip((query.page -1) * query.limit).take(query.limit)
        return {
          statusCode: 200,
          message: "success",
          data: await builder.getMany()
        }
      }
      if (query.name !== '') {
        builder.where('name LIKE :name',{name: query.name}).skip((query.page -1) * query.limit).take(query.limit)
        return {
          statusCode: 200,
          message: "success",
          data: await builder.getMany()
        }
      }    
      return {
        statusCode: 200,
        message: "success",
        data: await this.usersRepository.find({      
          skip:(query.page -1) * query.limit,
          take: query.limit
        })
      }
    }catch(err){
      throw new HttpException(err.detail ? err.detail : "User not found", HttpStatus.NOT_FOUND);
    }
  }

  async findOne(id: number): Promise<object> {
    return await this.usersRepository.findOneBy({ id })
      .then(result=>{
        if (result) {
          return {
            statusCode: 200,
            message: "success",
            data: [result]
          }
        }
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      })
      .catch(err=>{
        throw new HttpException(err.detail ? err.detail : err.response, HttpStatus.NOT_FOUND);
      })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<object> {
    return await this.usersRepository.update(id,updateUserDto)
      .then(async(result)=>{
        if (result.affected) {
          const updateUser = await this.usersRepository.findOneBy({id});
          return {
            statusCode: 200,
            message: "Success",
            data: [updateUser]
          }
        }      
        throw new HttpException("User id not found", HttpStatus.NOT_FOUND);
      })
      .catch(err=>{
        throw new HttpException(err.detail ? err.detail : err.response, HttpStatus.NOT_FOUND);
      })
  }

  async remove(id: number): Promise<object> {
    return await this.usersRepository.delete(id)
      .then((result)=>{
        if (!result.affected) {
          throw new HttpException('Failed', HttpStatus.NOT_FOUND);
        }else{
          return {
            "statusCode": 200,
            "message": "Success"
          }
        }
      })
      .catch(err=>{
        throw new HttpException(err.detail ? err.detail : err.response, HttpStatus.NOT_FOUND);
      })
 
  }
}

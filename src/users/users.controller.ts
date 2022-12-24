import { Controller, Get, Post, Body, Param, Delete, Put , Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { query } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('filters')
  getUsersByFilters(@Query() query: FilterUserDto) {
    console.log(query)
    return this.usersService.getUsersByFilters(query)
    // return query
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    console.log('getOne')
    return this.usersService.findOne(id);
  }  

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }


  
}

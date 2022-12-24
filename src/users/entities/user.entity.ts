import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {  IsEmail,  } from 'class-validator';

@Entity({ name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true})
  name: string;

  @Column()
  age: number;

  @IsEmail()
  @Column({ type: 'varchar', nullable: true, unique: true })
  email: string;

  @Column({ nullable: true})
  avatarUrl: string;
}
/* eslint-disable prettier/prettier */
import { Task } from './task.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany,  } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    email:string;
    
    @Column()
    userName:string;

    @Column()
    password:string;

    @Column({nullable:true})
    linkedinurl?:string

    @Column({nullable:true})
    profilePicture?:string;

    @OneToMany(() => Task, task => task.user)
    tasks:Task[];


}
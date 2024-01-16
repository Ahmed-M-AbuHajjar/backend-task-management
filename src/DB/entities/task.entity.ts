/* eslint-disable prettier/prettier */
import { User } from './user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,  } from 'typeorm';

export enum TaskCategory{
    WORK = 'work',
    PERSONAL = 'personal',
    SHOPPING = 'shopping',
}

@Entity()
export class Task{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;
    
    @Column()
    description:string;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    dueDate:Date;

    @Column({type:'enum', enum:TaskCategory,default:TaskCategory.PERSONAL})
    category:TaskCategory;

    @Column({default:false})
    completed:boolean;

    @ManyToOne(() => User, user => user.tasks)
    user:User;

}
/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../../DB/entities/user.entity';
import { Task } from './../../DB/entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository:Repository<Task>
    ){}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const task = this.taskRepository.create({...createTaskDto});
    task.user = user;
    const savedTask = await this.taskRepository.save(task);
    const {id, email, userName} = user;
    return {message:'Task created successfully', task:{title: savedTask.title,description: savedTask.description,dueDate: savedTask.dueDate,id: savedTask.id,category: savedTask.category,completed: savedTask.completed,},user:{id, email,userName}}
  }

  async findAll(user: User) {
    return await this.taskRepository.find({where: { user }});
  }

  async findOne(id: number, user: User) {
    const task = await this.taskRepository.findOne({where: { id, user }});
    if(!task){
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return task
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user: User) {
    await this.findOne(id, user);
    await this.taskRepository.update(id, updateTaskDto);
    return await this.taskRepository.findOne({where: { id }});
  }

  async remove(id: number, user: User) {
    await this.findOne(id, user);
    await this.taskRepository.delete(id);
    return {message: 'Task removed successfully'};
  }
}

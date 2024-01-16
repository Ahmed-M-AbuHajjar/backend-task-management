/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';


@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req, @Res() res) {
   try {
    const { task, user } = await this.taskService.create(createTaskDto, req.user);
    res.status(HttpStatus.CREATED).json({message:'Task created successfully', task,user})} catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error creating task', error:error.message});
   }
  }

  @Get()
  async findAll(@Req() req, @Res() res) {
    try {
      const tasks = await this.taskService.findAll(req.user);
      res.status(HttpStatus.OK).json({message:'Tasks retrived successfully',tasks,user: { id: req.user.id, name: req.user.name, email: req.user.email }});
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error fetching tasks', error:error.message});
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const task = await this.taskService.findOne(+id, req.user);
      res.status(HttpStatus.OK).json({message:'Task retrived successfully',task,user: { id: req.user.id, name: req.user.name, email: req.user.email }});
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error fetching task', error:error.message});
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req, @Res() res) {
    try {
      const updatedTask = await this.taskService.update(+id,updateTaskDto,req.user);
      res.status(HttpStatus.OK).json({message:'Task updated successfully', updatedTask,user: { id: req.user.id, name: req.user.name, email: req.user.email }});
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error updating task', error:error.message});
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      await this.taskService.remove(+id, req.user);
      res.status(HttpStatus.OK).json({message:'Task removed successfully'});
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error removing task',error:error.message});
    }
  }
}

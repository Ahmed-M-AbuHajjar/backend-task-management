/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsDate, IsEnum, IsString,IsOptional,IsNotEmpty } from 'class-validator';
import { TaskCategory } from './../../../DB/entities/task.entity';


export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsOptional()
    @IsNotEmpty({message:'Title should not be empty'})
    @IsString({message:'Title should be a string'})
    title?: string;

    @IsOptional()
    @IsNotEmpty({message:'Description should not be empty'})
    @IsString({message:'Description should be a string'})
    description?: string;

    @IsOptional()
    @IsNotEmpty({message:'Due date should not be empty'})
    @IsDate({message:'Invalid due date'})
    dueDate?: Date;

    @IsOptional()
    @IsEnum(TaskCategory, {message:'Invalid task category'})
    category?:TaskCategory;
}

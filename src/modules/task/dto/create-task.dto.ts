/* eslint-disable prettier/prettier */
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskCategory } from 'src/DB/entities/task.entity';

export class CreateTaskDto {
    @IsNotEmpty({message:'Title should not be empty'})
    @IsString({message:'Title should be a string'})
    title: string;

    @IsNotEmpty({message:'Description should not be empty'})
    @IsString({message:'Description should be a string'})
    description: string;

    @IsNotEmpty({message:'Due date should not be empty'})
    @IsDate({message:'Invalid due date'})
    dueDate: Date;

    @IsEnum(TaskCategory, {message:'Invalid task category'})
    category:TaskCategory;
}

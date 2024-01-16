/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Task } from './../../DB/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([Task]),
    PassportModule,
    JwtModule.register({
      secret:'coolcode',
      signOptions:{expiresIn: '1h'},
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports:[JwtModule]
})
export class TaskModule {}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceOptions } from './DB/data-source';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forRoot(datasourceOptions)  ,  UserModule, TaskModule,JwtModule.register({
    secret:'coolcode',
    signOptions:{expiresIn:'1h'},
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
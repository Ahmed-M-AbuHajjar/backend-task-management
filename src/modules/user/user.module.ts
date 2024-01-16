/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './../auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { User } from './../../DB/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkedInService } from './../../service/linkedin.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret:'coolcode',
      signOptions:{expiresIn:'1h'}
    }),
  ],
  controllers: [UserController],
  providers: [UserService,JwtStrategy,LinkedInService],
  exports:[JwtModule]
})
export class UserModule {}

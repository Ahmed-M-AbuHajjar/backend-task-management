/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, HttpException, HttpStatus  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-dto';
import { User } from './../../DB/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  private async validateLinkedInUrl(linkedinUrl:string, userId?:number): Promise<void>{
    const registeredWithLinkedin = await this.userRepository.findOne({ where: { linkedinurl: linkedinUrl } });
    if(registeredWithLinkedin && registeredWithLinkedin.id !== userId){
      throw new HttpException('LinkedIn URL is already associated with another user', HttpStatus.BAD_REQUEST);
    }
  }

  async create(createUserDto: CreateUserDto):Promise<User> {
    const isRegistered = await this.userRepository.findOne({ where: {email: createUserDto.email}});
    if(isRegistered){
      throw new HttpException('User already registered',HttpStatus.BAD_REQUEST);
    } else{
      if(createUserDto.linkedinurl){
        await this.validateLinkedInUrl(createUserDto.linkedinurl)
      }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    const user = this.userRepository.create({...createUserDto, password:hashedPassword});
    return await this.userRepository.save(user)
    }
  }

  async findAll():Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({where: { id }});
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | undefined> {
    if(updateUserDto.linkedinurl){
      await this.validateLinkedInUrl(updateUserDto.linkedinurl, id);
    }
    await this.userRepository.update(id,updateUserDto);
    return await this.userRepository.findOne({where: { id }});
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({where: { id }});
    if(!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.remove(user);
  }

  async login(loginDto:LoginDto): Promise<{user:User; accessToken: string}> {
    const {email,password} = loginDto;
    const user = await this.userRepository.findOne({where:{email}});

    if(!user){
      throw new UnauthorizedException('Inavlid email');
    } else {
    const passwordMatch = await bcrypt.compare(password,user.password);
    
    if(!passwordMatch){
      throw new UnauthorizedException('Invalid password');
    } else{
    const accessToken = this.jwtService.sign({sub:user.id,email:user.email});
    return {user, accessToken};
    }
  }
  }

  async findByEmail(email:string): Promise<User | undefined>{
    return await this.userRepository.findOne({where:{email}});
  }

  async validateUser(email:string,password:string):Promise<User>{
    const user = await this.findByEmail(email);
    if(!user){
      throw new UnauthorizedException('Invalid user');
    }

    if(!(await bcrypt.compare(password,user.password))){
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
}

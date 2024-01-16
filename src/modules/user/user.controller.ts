/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, HttpStatus, HttpException, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { LoginDto } from './dto/login-dto';
import { UnauthorizedException } from '@nestjs/common';
import { LinkedInService } from './../../service/linkedin.service';




@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly linkedInService:LinkedInService,
    ) {}


  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
   try {
    const user = await this.userService.create(createUserDto);
    res.status(HttpStatus.CREATED).json({message:'User created successfully!',user});
   } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error creating user', error: error.message});
   }
  }

  @Post('login')
  async login(@Body() loginDto:LoginDto, @Res() res){
    try {
      const { user, accessToken} = await this.userService.login(loginDto);

      res.status(HttpStatus.ACCEPTED).json({message:'Login successful',user,accessToken});
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error Invalid login', error: error.message});
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      const users = await this.userService.findAll();
      res.status(HttpStatus.OK).json(users);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users', error: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const user = await this.userService.findOne(+id);
      if(!user){
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error fetching user', error: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/linkedin-profile')
  async getLinkedInProfile(@Param('id') id:string, @Res() res, @Req() req){
    try {
      const userId = req.user.id;
      if(userId !== +id){
        throw new UnauthorizedException('Unauthorized access to this LinkedIn profile');
      } 
      const user = await this.userService.findOne(+id);
      if(!user){
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if(!user.linkedinurl){
        throw new HttpException('LinkedIn URL not provided', HttpStatus.BAD_REQUEST);
      }
      const linkedInProfile = await this.linkedInService.scrapeUserProfile(user.linkedinurl);
      const updatedUser = await this.userService.update(+id, {userName:linkedInProfile.userName,linkedinurl:user.linkedinurl})
      res.status(HttpStatus.OK).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message || 'Error fetching LinkedIn profile', error: error.message});

    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res, @Req() req) {
    try {
      const userId = req.user.id;
      if(userId !== +id){
        throw new UnauthorizedException('Unauthorized to update this user');
      } else {
      const updatedUser = await this.userService.update(+id, updateUserDto);
      if(!updatedUser){
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      res.status(HttpStatus.OK).json({message:'User updated successfully', user:updatedUser});
    }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error updating user', error: error.message});
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res, @Req() req) {
    try {
       const userId = req.user.id;
       if(userId !== +id){
        throw new UnauthorizedException('Unauthorized to delete this user');
       } else {
       await this.userService.remove(+id);
       res.status(HttpStatus.OK).json({message:'User removed successfully'})
       }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error removing user', error: error.message});
    }
  }
}

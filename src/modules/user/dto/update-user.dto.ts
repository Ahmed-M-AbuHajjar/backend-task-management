/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, Matches,IsOptional,IsUrl } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsNotEmpty({ message: 'Password should not be empty' })
    @Matches(/^(?=.*\d).{8,}$/,{message:'Password must be at least 8 characters long and contain at least one number'})
    password?:string;

    @IsOptional()
    @IsNotEmpty({ message: 'Username should not be empty' })
    @IsString({message:'UserName should be string'})
    userName?:string;

    @IsOptional()
    @IsUrl({}, {message:'Invalid LinkedIn URL'})
    linkedinurl?: string;

    @IsOptional()
    @IsUrl({},{message:'Invalid profile picture URL'})
    profilePicture?: string;
}

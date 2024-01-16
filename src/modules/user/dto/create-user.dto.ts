/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Matches, IsUrl,IsOptional  } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: 'Username should not be empty' })
    @IsString({message:'UserName should be string'})
    userName:string;

    @IsNotEmpty({ message: 'Email should not be empty' })
    @IsEmail()
    email:string;

    @IsNotEmpty({ message: 'Password should not be empty' })
    @Matches(/^(?=.*\d).{8,}$/,{message:'Password must be at least 8 characters long and contain at least one number'})
    password:string;

    @IsUrl({},{message:'Invalid LinkedIn URL'})
    @IsOptional()
    linkedinurl?:string;

    @IsUrl({},{message:'Invalid profile picture URL'})
    @IsOptional()
    profilePicture?:string;
}

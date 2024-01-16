/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail,Matches,IsUrl } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'Email should not be empty' })
    @IsEmail()
    email:string;

    @IsNotEmpty({ message: 'Password should not be empty' })
    @Matches(/^(?=.*\d).{8,}$/,{message:'Password must be at least 8 characters long and contain at least one number'})
    password:string;

    @IsUrl({},{message:'Invalid LinkedIn URL'})
    linkedinurl:string
}


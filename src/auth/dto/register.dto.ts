import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(2, 100)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;
}

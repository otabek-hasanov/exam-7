import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'Ali Valiyev' })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  fullName?: string;

  @ApiProperty({ required: false, example: '+998901234567' })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateInquiryDto {
  @ApiProperty({ example: 'Assalomu alaykum, uy hali sotuvdami?' })
  @IsString()
  @Length(10, 1000)
  message: string;

  @ApiProperty({ example: '+998901234567' })
  @IsPhoneNumber('UZ')
  phone: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Kvartira' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'kvartira' })
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'slug faqat kichik harf, raqam va tiredan iborat bo‘lishi kerak',
  })
  slug: string;
}

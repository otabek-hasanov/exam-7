import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadImagesDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  images: any[];

  @ApiProperty({ required: false, example: 'Mehmonxona' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  altText?: string;
}

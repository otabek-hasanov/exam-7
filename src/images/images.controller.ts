import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '../auth/auth.guard.js';
import { UploadImagesDto } from './dto/upload-images.dto.js';
import { ImagesService } from './images.service.js';

@ApiTags('Images')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('properties/:id/images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, name + extname(file.originalname).toLowerCase());
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          !['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
        ) {
          return cb(
            new BadRequestException('Faqat jpg, png yoki webp rasm yuklang'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  upload(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UploadImagesDto,
    @Req() req: any,
  ) {
    return this.imagesService.upload(id, files, dto, req.user.id);
  }

  @Delete(':imageId')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
    @Req() req: any,
  ) {
    return this.imagesService.remove(id, imageId, req.user.id);
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service.js';
import { UploadImagesDto } from './dto/upload-images.dto.js';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async upload(
    propertyId: number,
    files: Express.Multer.File[],
    dto: UploadImagesDto,
    userId: number,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Kamida bitta rasm yuklang');
    }

    let property;
    try {
      property = await this.checkOwner(propertyId, userId);
    } catch (error) {
      for (const file of files) {
        await this.deleteFile('/uploads/' + file.filename);
      }
      throw error;
    }

    const imagesCount = await this.prisma.propertyImage.count({
      where: { propertyId },
    });

    const images: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const image = await this.prisma.propertyImage.create({
        data: {
          url: '/uploads/' + files[i].filename,
          altText: dto.altText || property.title,
          sortOrder: imagesCount + i,
          propertyId,
        },
      });
      images.push(image);
    }

    return images;
  }

  async remove(propertyId: number, imageId: number, userId: number) {
    await this.checkOwner(propertyId, userId);

    const image = await this.prisma.propertyImage.findUnique({
      where: { id: imageId },
    });
    if (!image || image.propertyId !== propertyId) {
      throw new NotFoundException('Rasm topilmadi');
    }

    await this.prisma.propertyImage.delete({
      where: { id: imageId },
    });

    await this.deleteFile(image.url);

    return { message: 'Rasm o‘chirildi' };
  }

  private async deleteFile(url: string) {
    try {
      await unlink(join(process.cwd(), url));
    } catch {}
  }

  private async checkOwner(propertyId: number, userId: number) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      throw new NotFoundException('E’lon topilmadi');
    }
    if (property.userId !== userId) {
      throw new ForbiddenException('Bu sizning e’loningiz emas');
    }
    return property;
  }
}

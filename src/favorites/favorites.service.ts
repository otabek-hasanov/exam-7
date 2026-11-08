import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          include: {
            category: true,
            images: true,
          },
        },
      },
    });
  }

  async add(propertyId: number, userId: number) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property || property.status !== 'APPROVED') {
      throw new NotFoundException('E’lon topilmadi');
    }

    const oldFavorite = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });
    if (oldFavorite) {
      throw new ConflictException('Bu e’lon allaqachon saqlangan');
    }

    return this.prisma.favorite.create({
      data: { userId, propertyId },
    });
  }

  async remove(propertyId: number, userId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });
    if (!favorite) {
      throw new NotFoundException('Saqlangan e’lon topilmadi');
    }

    await this.prisma.favorite.delete({
      where: { id: favorite.id },
    });

    return { message: 'E’lon saqlanganlardan olib tashlandi' };
  }
}

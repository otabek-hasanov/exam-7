import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateCategoryDto) {
    const oldCategory = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    if (oldCategory) {
      throw new ConflictException('Bu slug allaqachon mavjud');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
      },
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }

    if (dto.slug && dto.slug !== category.slug) {
      const oldCategory = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });
      if (oldCategory) {
        throw new ConflictException('Bu slug allaqachon mavjud');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
      },
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }

    const propertiesCount = await this.prisma.property.count({
      where: { categoryId: id },
    });
    if (propertiesCount > 0) {
      throw new ConflictException(
        'Bu kategoriyada e’lonlar bor, avval ularni o‘chiring',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Kategoriya o‘chirildi' };
  }
}

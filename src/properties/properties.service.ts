import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { PropertiesQueryDto } from './dto/properties-query.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  private include = {
    category: true,
    images: true,
    user: {
      select: { id: true, fullName: true, email: true, phone: true },
    },
  };

  async findAll(query: PropertiesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    ) {
      throw new BadRequestException(
        'minPrice maxPrice dan katta bo‘lmasligi kerak',
      );
    }

    const where: any = { status: 'APPROVED' };

    if (query.city) {
      where.city = { contains: query.city, mode: 'insensitive' };
    }
    if (query.category) {
      where.categoryId = query.category;
    }
    if (query.type) {
      where.listingType = query.type;
    }
    if (query.rooms) {
      where.rooms = query.rooms;
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === 'price_asc') {
      orderBy = { price: 'asc' };
    }
    if (query.sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    const properties = await this.prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: this.include,
    });

    const total = await this.prisma.property.count({ where });

    return {
      data: properties,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findMy(userId: number) {
    return this.prisma.property.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: this.include,
    });
  }

  async findOne(id: number, user: any) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: this.include,
    });
    if (!property) {
      throw new NotFoundException('E’lon topilmadi');
    }

    const isOwner = user && user.id === property.userId;
    const isAdmin = user && user.role === 'ADMIN';

    if (property.status !== 'APPROVED' && !isOwner && !isAdmin) {
      throw new NotFoundException('E’lon topilmadi');
    }

    return property;
  }

  async create(dto: CreatePropertyDto, userId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }

    return this.prisma.property.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        currency: dto.currency,
        listingType: dto.listingType,
        address: dto.address,
        city: dto.city,
        area: dto.area,
        rooms: dto.rooms,
        bathrooms: dto.bathrooms,
        status: 'PENDING',
        categoryId: dto.categoryId,
        userId: userId,
      },
      include: this.include,
    });
  }

  async update(id: number, dto: UpdatePropertyDto, userId: number) {
    await this.checkOwner(id, userId);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Kategoriya topilmadi');
      }
    }

    return this.prisma.property.update({
      where: { id },
      data: dto,
      include: this.include,
    });
  }

  async remove(id: number, userId: number) {
    await this.checkOwner(id, userId);

    await this.prisma.property.delete({
      where: { id },
    });

    return { message: 'E’lon o‘chirildi' };
  }

  private async checkOwner(id: number, userId: number) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });
    if (!property) {
      throw new NotFoundException('E’lon topilmadi');
    }
    if (property.userId !== userId) {
      throw new ForbiddenException('Bu sizning e’loningiz emas');
    }
  }
}

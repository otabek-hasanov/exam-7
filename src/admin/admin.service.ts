import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AdminPropertiesQueryDto } from './dto/admin-properties-query.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getProperties(query: AdminPropertiesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = query.status ? { status: query.status } : {};

    const properties = await this.prisma.property.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: true,
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
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

  async updateStatus(id: number, dto: UpdateStatusDto) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });
    if (!property) {
      throw new NotFoundException('E’lon topilmadi');
    }

    return this.prisma.property.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  getUsers() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
  }
}

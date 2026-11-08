import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private select = {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    role: true,
    createdAt: true,
  };

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.select,
    });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return user;
  }

  async updateMe(userId: number, dto: UpdateUserDto) {
    await this.getMe(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
      },
      select: this.select,
    });
  }
}

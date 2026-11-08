import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(propertyId: number, dto: CreateInquiryDto, userId: number) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property || property.status !== 'APPROVED') {
      throw new NotFoundException('E’lon topilmadi');
    }
    if (property.userId === userId) {
      throw new ForbiddenException('O‘z e’loningizga murojaat yubora olmaysiz');
    }

    return this.prisma.inquiry.create({
      data: {
        message: dto.message,
        phone: dto.phone,
        senderId: userId,
        propertyId: propertyId,
      },
    });
  }

  findMy(userId: number) {
    return this.prisma.inquiry.findMany({
      where: { senderId: userId },
      orderBy: { id: 'desc' },
      include: {
        property: {
          include: {
            images: true,
            user: {
              select: { id: true, fullName: true, phone: true },
            },
          },
        },
      },
    });
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
import { InquiriesService } from './inquiries.service.js';

@ApiTags('Inquiries')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class InquiriesController {
  constructor(private inquiriesService: InquiriesService) {}

  @Post('properties/:propertyId/inquiries')
  create(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Body() dto: CreateInquiryDto,
    @Req() req: any,
  ) {
    return this.inquiriesService.create(propertyId, dto, req.user.id);
  }

  @Get('inquiries/my')
  findMy(@Req() req: any) {
    return this.inquiriesService.findMy(req.user.id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { AdminService } from './admin.service.js';
import { AdminPropertiesQueryDto } from './dto/admin-properties-query.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('properties')
  getProperties(@Query() query: AdminPropertiesQueryDto) {
    return this.adminService.getProperties(query);
  }

  @Patch('properties/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.adminService.updateStatus(id, dto);
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard.js';
import { OptionalAuthGuard } from '../auth/optional-auth.guard.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { PropertiesQueryDto } from './dto/properties-query.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { PropertiesService } from './properties.service.js';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @Get()
  findAll(@Query() query: PropertiesQueryDto) {
    return this.propertiesService.findAll(query);
  }

  @Get('my')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findMy(@Req() req: any) {
    return this.propertiesService.findMy(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.propertiesService.findOne(id, req.user);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreatePropertyDto, @Req() req: any) {
    return this.propertiesService.create(dto, req.user.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePropertyDto,
    @Req() req: any,
  ) {
    return this.propertiesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.propertiesService.remove(id, req.user.id);
  }
}

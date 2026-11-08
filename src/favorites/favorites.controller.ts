import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard.js';
import { FavoritesService } from './favorites.service.js';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.favoritesService.findAll(req.user.id);
  }

  @Post(':propertyId')
  add(@Param('propertyId', ParseIntPipe) propertyId: number, @Req() req: any) {
    return this.favoritesService.add(propertyId, req.user.id);
  }

  @Delete(':propertyId')
  remove(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Req() req: any,
  ) {
    return this.favoritesService.remove(propertyId, req.user.id);
  }
}

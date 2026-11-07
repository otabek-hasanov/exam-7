import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @Length(5, 150)
  title: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsIn(['USD', 'UZS'])
  currency: 'USD' | 'UZS';

  @IsIn(['SALE', 'RENT'])
  listingType: 'SALE' | 'RENT';

  @IsInt()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  area: number;

  @IsInt()
  @IsPositive()
  rooms: number;

  @IsInt()
  @Min(0)
  bathrooms: number;
}

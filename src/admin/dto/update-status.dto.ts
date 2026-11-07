import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';
}

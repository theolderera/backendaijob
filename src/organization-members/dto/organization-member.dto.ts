import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddMemberDto {
  @IsNumber()
  organizationId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  role?: string;
}

export class RespondMemberDto {
  @IsString()
  status: string; // 'Accepted' | 'Rejected'
}

import { IsString, IsEmail, IsNumber, IsOptional, IsIn, Min, Max } from 'class-validator';

export class UpdateCensusDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  idDocument?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsIn(['Residential', 'Commercial', 'Industrial'])
  @IsOptional()
  propertyType?: string;

  @IsNumber()
  @Min(1)
  @Max(6)
  @IsOptional()
  estrato?: number;

  @IsString()
  @IsIn(['Active', 'Inactive', 'Pending'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  municipality?: string;
}

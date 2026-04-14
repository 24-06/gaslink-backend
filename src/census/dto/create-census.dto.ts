import { IsString, IsEmail, IsNumber, IsOptional, IsIn, Min, Max } from 'class-validator';

export class CreateCensusDto {
  @IsString()
  fullName: string;

  @IsString()
  idDocument: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsIn(['Residential', 'Commercial', 'Industrial'])
  propertyType: string;

  @IsNumber()
  @Min(1)
  @Max(6)
  estrato: number;

  @IsString()
  @IsIn(['Active', 'Inactive', 'Pending'])
  status: string;

  @IsString()
  department: string;

  @IsString()
  municipality: string;
}

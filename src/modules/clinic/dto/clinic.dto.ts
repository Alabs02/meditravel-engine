import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

class ClinicProcedureDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;
}

export class CreateClinicDto {
  @IsString()
  clinicName: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ClinicProcedureDto)
  procedures?: ClinicProcedureDto[];

  @IsOptional()
  @IsNumber()
  clinicEstimatedCost?: number;

  @IsOptional()
  @IsNumber()
  usEstimatedCost?: number;

  @IsOptional()
  @IsNumber()
  saving?: number;
}

export class UpdateClinicDto {
  @IsOptional()
  @IsString()
  clinicName?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ClinicProcedureDto)
  procedures?: ClinicProcedureDto[];

  @IsOptional()
  @IsNumber()
  clinicEstimatedCost?: number;

  @IsOptional()
  @IsNumber()
  usEstimatedCost?: number;

  @IsOptional()
  @IsNumber()
  saving?: number;
}

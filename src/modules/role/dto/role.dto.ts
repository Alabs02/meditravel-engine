import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(["system", "custom"], {
    message: "type must be either 'system' or 'custom'"
  })
  type?: "system" | "custom";
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(["system", "custom"])
  type?: "system" | "custom";
}

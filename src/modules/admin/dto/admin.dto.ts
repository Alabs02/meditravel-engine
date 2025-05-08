import { IsEmail, IsMongoId, IsString, MinLength } from "class-validator";

export class CreateUserByAdminDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsMongoId()
  roleId: string;
}

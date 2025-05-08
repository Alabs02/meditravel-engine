import { IsMongoId, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: "photoUrl must be a valid URL" })
  photoUrl?: string;

  @IsOptional()
  @IsMongoId({ message: "roleId must be a valid Mongo ID" })
  roleId?: string;
}

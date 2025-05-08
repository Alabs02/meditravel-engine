import { UserDocument } from "@user/entities/user.entity";

export function isAdmin(user: UserDocument | null | undefined): boolean {
  if (!user) return false;

  const role =
    typeof user.role === "string" ? user.role : user.role?.toString();

  return role === "admin";
}

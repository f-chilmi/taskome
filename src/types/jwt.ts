export type JwtType = "access" | "refresh";

export interface IJwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

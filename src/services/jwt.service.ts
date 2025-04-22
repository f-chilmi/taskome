import { Secret, sign, verify } from "jsonwebtoken";
import { accessTokenExpiry, accessTokenSecret } from "../config";
import { IJwtPayload, JwtType } from "../types";

export class JwtService {
  static generateAccessToken(
    { exp: _exp, iat: _iat, ...payload }: IJwtPayload,
    expiresIn = parseInt(accessTokenExpiry)
  ) {
    return sign(payload, accessTokenSecret as Secret, { expiresIn });
  }

  // static generateRefreshToken({
  //   exp: _exp,
  //   iat: _iat,
  //   ...payload
  // }: IJwtPayload) {
  //   const expiresIn = parseInt(accessTokenExpiry);
  //   return sign(payload, refreshTokenSecret as Secret, {
  //     expiresIn,
  //   });
  // }

  static generateTokens(id: string) {
    const payload: IJwtPayload = { id };

    const accessToken = this.generateAccessToken(payload);

    return { accessToken };
  }

  static verify(token: string, type: JwtType): IJwtPayload {
    const secret = accessTokenSecret;

    return verify(token, secret as Secret) as IJwtPayload;
  }
}

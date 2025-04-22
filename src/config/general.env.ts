import env from "./env";

export const accessTokenSecret = env("ACCESS_TOKEN_SECRET");
export const accessTokenExpiry = env("ACCESS_TOKEN_EXPIRY");
export const bcryptSaltRounds = env("BCRYPT_SALT_ROUNDS");

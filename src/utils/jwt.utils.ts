import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const generateToken = (
  payload: string | object | Buffer,
  expiresIn: SignOptions['expiresIn'] = '2d'
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET as string, options);
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET as string);
};

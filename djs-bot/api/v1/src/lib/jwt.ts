import jwt from 'jsonwebtoken';
import APIError from './APIError';
const { JWT_SECRET_KEY } = process.env;

const checkSecretKey = () => {
  if (!JWT_SECRET_KEY?.length)
    throw new APIError(
      "No authorization set up, I can't allow you to do anything. Have a nice day and go sleep",
      APIError.STATUS_CODES.INTERNAL_ERROR,
      APIError.ERROR_CODES.INVALID_CONFIGURATION,
    );

  return true;
};

interface IJWTPayload {
  user_id: string;
}

export const signToken = (payload: IJWTPayload) => {
  checkSecretKey();

  return jwt.sign(payload, JWT_SECRET_KEY as string);
};

export const verifyToken = (token: string) => {
  checkSecretKey();

  return jwt.verify(token, JWT_SECRET_KEY as string) as unknown as IJWTPayload;
};

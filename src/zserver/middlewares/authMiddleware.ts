import jwt from "jsonwebtoken";
import { STATUS } from "../utils/statusCodes";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const authMiddleware = (cookie: ReadonlyRequestCookies) => {
  const authHeader = cookie.get("token")?.value;

  if (!authHeader) {
    return {
      status: STATUS.UNAUTHORIZED,
      message: "No token provided",
    };
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return {
      status: STATUS.UNAUTHORIZED,
      message: "No token provided",
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    return {
      status: STATUS.OK,
      User: { ...(decoded as { id: number; email: string }) },
    };
  } catch {
    return {
      status: STATUS.UNAUTHORIZED,
      message: "No token provided",
    };
  }
};

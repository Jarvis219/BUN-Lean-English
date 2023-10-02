import { HTTP_CODE_ERRORS } from "@/constants";
import { verify } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  callback: (req: Request) => Promise<Response>
): Promise<Response> | Response => {
  const token = req.headers.get("Authorization");
  if (!token) {
    return new Response(JSON.stringify({ message: "Missing token" }), {
      status: HTTP_CODE_ERRORS.UNAUTHORIZED,
    });
  }

  const [_, tokenValue] = token.split("Bearer ");
  if (!tokenValue) {
    return new Response(JSON.stringify({ message: "Missing token" }), {
      status: HTTP_CODE_ERRORS.UNAUTHORIZED,
    });
  }

  try {
    const { _id } = verify(
      tokenValue,
      process.env.JWT_SECRET_KEY as string
    ) as {
      _id: string;
    };

    req.headers.set("userId", _id);
  } catch (error) {
    return new Response(JSON.stringify({ message: "Token is not valid" }), {
      status: HTTP_CODE_ERRORS.UNAUTHORIZED,
    });
  }

  return callback(req);
};

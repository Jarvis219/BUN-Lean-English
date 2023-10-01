import { verify } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  callback: (req: Request) => Promise<Response>
): Promise<Response> | Response => {
  const token = req.headers.get("Authorization");
  if (!token) {
    return new Response(JSON.stringify({ message: "Missing token" }), {
      status: 401,
    });
  }

  const [_, tokenValue] = token.split("Bearer ");
  if (!tokenValue) {
    return new Response(JSON.stringify({ message: "Missing token" }), {
      status: 401,
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
      status: 401,
    });
  }

  return callback(req);
};

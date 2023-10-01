import { User } from "@/models";
import { sign } from "jsonwebtoken";

// Register
export const registerUser = async (req: Request): Promise<Response> => {
  const body = await req.json();

  if (!body.email || !body.password || !body.name) {
    return new Response(JSON.stringify({ message: "Missing field" }), {
      status: 400,
    });
  }

  // Check name user is exist
  const nameIsExit = await User.findOne({ email: body.email });
  if (nameIsExit) {
    return new Response(JSON.stringify({ message: "Account is exist" }), {
      status: 400,
    });
  }

  // hash password
  const hashPasswordWithSecret = body.password + process.env.SECRET_KEY;

  const salt = await Bun.password.hash(hashPasswordWithSecret, {
    algorithm: "bcrypt",
    cost: 10,
  });
  body.hashed_password = salt;

  try {
    const user = new User(body);
    const userSaved = await user.save();
    return new Response(JSON.stringify(userSaved));
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
};

// Login
export const loginUser = async (req: Request): Promise<Response> => {
  const body = await req.json();

  if (!body.email || !body.password) {
    return new Response(JSON.stringify({ message: "Missing field" }), {
      status: 400,
    });
  }

  let user = null;

  try {
    user = await User.findOne({ email: body.email });
  } catch (error) {
    return new Response(JSON.stringify(error));
  }

  if (!user) {
    return new Response(JSON.stringify({ message: "Account is not exist" }), {
      status: 400,
    });
  }

  const verifyPassword = await Bun.password.verify(
    body.password + process.env.SECRET_KEY,
    user.hashed_password
  );

  if (!verifyPassword) {
    return new Response(
      JSON.stringify({ message: "Password is not correct" }),
      {
        status: 400,
      }
    );
  }

  const { token } = buildToken(user._id.toString());
  user.token = token;

  return new Response(JSON.stringify(user));
};

const buildToken = (_id: string) => {
  const expires = "60 days";
  const token = sign(
    {
      _id,
    },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: expires,
    }
  );

  return { token };
};

// TODO: update info user

import { HTTP_CODE_ERRORS } from "@/constants";
import { User } from "@/models";
import { sign } from "jsonwebtoken";

// Register
export const registerUser = async (req: Request): Promise<Response> => {
  const body = await req.json();

  if (!body.email || !body.password || !body.name) {
    return new Response(JSON.stringify({ message: "Missing field" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  // Check name user is exist
  const nameIsExit = await User.findOne({ email: body.email });
  if (nameIsExit) {
    return new Response(JSON.stringify({ message: "Account is exist" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  // hash password
  const hashPasswordWithSecret = body.password + process.env.SECRET_KEY;

  const salt = await Bun.password.hash(hashPasswordWithSecret, {
    algorithm: "bcrypt",
    cost: 10,
  });
  body.hashed_password = salt;

  let userSaved;

  try {
    const user = new User(body);
    userSaved = await user.save();
  } catch (error) {
    return new Response(JSON.stringify(error));
  }

  // create token and login
  const { token } = buildToken(userSaved._id.toString());
  userSaved.token = token;
  return new Response(JSON.stringify(userSaved));
};

// Login
export const loginUser = async (req: Request): Promise<Response> => {
  const body = await req.json();

  if (!body.email || !body.password) {
    return new Response(JSON.stringify({ message: "Missing field" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
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
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
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
        status: HTTP_CODE_ERRORS.BAD_REQUEST,
      }
    );
  }

  const { token } = buildToken(user._id.toString());
  user.token = token;

  return new Response(JSON.stringify(user));
};

export const logoutUser = async (req: Request): Promise<Response> => {
  const userId = req.headers.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ message: "Missing userId" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  try {
    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      { token: "" },
      {
        new: true,
      }
    );

    return new Response(
      JSON.stringify({
        message: "Logout success",
      })
    );
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
};

// Login with Google account
export const loginWithGoogle = async (req: Request): Promise<Response> => {
  const body = await req.json();

  if (!body.email || !body.name) {
    return new Response(JSON.stringify({ message: "Missing field" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  let user = null;

  try {
    user = await User.findOne({ email: body.email });
  } catch (error) {
    return new Response(JSON.stringify(error));
  }

  if (!user) {
    body.hashed_password = await Bun.password.hash(
      process.env.SECRET_KEY + body.email || body.email,
      {
        algorithm: "bcrypt",
        cost: 10,
      }
    );
    try {
      user = new User(body);
      await user.save();
    } catch (error) {
      return new Response(JSON.stringify(error));
    }
  }

  const { token } = buildToken(user._id.toString());
  user.token = token;

  return new Response(JSON.stringify(user));
};

// Reset password with email
export const resetPassword = async (req: Request): Promise<Response> => {
  const body = await req.json();

  if (!body.email || !body.password) {
    return new Response(JSON.stringify({ message: "Missing field" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
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
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  try {
    const hashPasswordWithSecret = body.password + process.env.SECRET_KEY;

    const salt = await Bun.password.hash(hashPasswordWithSecret, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const newUser = await User.findByIdAndUpdate(
      {
        _id: user._id,
      },
      { hashed_password: salt },
      {
        new: true,
      }
    );

    return new Response(
      JSON.stringify({
        message: "Reset password success",
        data: newUser,
      })
    );
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
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

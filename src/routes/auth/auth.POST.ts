import { HTTP_CODE_ERRORS, authRouter } from "@/constants";
import {
  loginUser,
  loginWithGoogle,
  logoutUser,
  registerUser,
} from "@/controllers";
import { authMiddleware } from "@/middlewares";

interface IAuthRouter {
  request: Request;
  router: string;
}

const authPOST = ({ request, router }: IAuthRouter) => {
  switch (router) {
    case authRouter.register:
      return registerUser(request);
    case authRouter.login:
      return loginUser(request);
    case authRouter.loginWithGoogle:
      return loginWithGoogle(request);
    case authRouter.logout:
      return authMiddleware(request, (req: Request) => logoutUser(req));
    default:
      return new Response("Not Found", { status: HTTP_CODE_ERRORS.NOT_FOUND });
  }
};

export { authPOST };

import { authRouter } from "@/constants";
import { loginUser, registerUser } from "@/controllers";

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
    default:
      return new Response("Not Found", { status: 404 });
  }
};

export { authPOST };

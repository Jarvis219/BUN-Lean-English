import { HTTP_CODE_ERRORS, categoriesRouter } from "@/constants";
import { createCategory, updateCategory } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { getRouter } from "@/utils";

interface ICategoriesRouter {
  request: Request;
  router: string;
}

const categoryPOST = ({ request, router }: ICategoriesRouter) => {
  switch (router) {
    case categoriesRouter.default:
      return authMiddleware(request, (req: Request) => {
        return createCategory(req);
      });
    case getRouter(router, categoriesRouter.id).routerMatch:
      return authMiddleware(request, (req: Request) =>
        updateCategory({
          request: req,
          params: {
            id: getRouter(router, categoriesRouter.id).paramsResultObject.id,
          },
        })
      );
    default:
      return new Response("Not Found", { status: HTTP_CODE_ERRORS.NOT_FOUND });
  }
};

export { categoryPOST };

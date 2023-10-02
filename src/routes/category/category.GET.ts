import { HTTP_CODE_ERRORS, categoriesRouter } from "@/constants";
import { getRouter } from "@/utils";

interface ICategoriesRouter {
  router: string;
}

const categoryGET = ({ router }: ICategoriesRouter) => {
  switch (router) {
    case categoriesRouter.default:
      return new Response("Categories");
    case getRouter(router, categoriesRouter.id).routerMatch:
      return new Response("Categories ID");
    default:
      return new Response("Not Found", { status: HTTP_CODE_ERRORS.NOT_FOUND });
  }
};

export { categoryGET };

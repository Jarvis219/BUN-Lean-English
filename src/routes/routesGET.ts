import { HTTP_CODE_ERRORS, prefixDefaultApi } from "@/constants";
import { categoryGET } from "@/routes/category";
import { vocabularyGET } from ".";

export const RouterGET = (req: Request): Promise<Response> | Response => {
  const router = req.url.split(prefixDefaultApi)[1];

  const routerMap = {
    categories: "categories",
    vocabulary: "vocabulary",
  };

  const routesDefine = router.split("/")[1];

  switch (routesDefine) {
    case routerMap.categories:
      return categoryGET({ router });
    case routerMap.vocabulary:
      return vocabularyGET({ request: req, router });
    default:
      return new Response("Not Found", { status: HTTP_CODE_ERRORS.NOT_FOUND });
  }
};

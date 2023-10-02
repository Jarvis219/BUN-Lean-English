import { HTTP_CODE_ERRORS, prefixDefaultApi } from "@/constants";
import { vocabularyDELETE } from "@/routes";

export const RouterDELETE = (req: Request): Promise<Response> | Response => {
  const router = req.url.split(prefixDefaultApi)[1];

  const routerMap = {
    categories: "categories",
    vocabulary: "vocabulary",
  };

  const routesDefine = router.split("/")[1];

  switch (routesDefine) {
    case routerMap.vocabulary:
      return vocabularyDELETE({ request: req, router });
    default:
      return new Response("Not Found", { status: HTTP_CODE_ERRORS.NOT_FOUND });
  }
};

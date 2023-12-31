import { HTTP_CODE_ERRORS, prefixDefaultApi } from "@/constants";
import { authPOST, categoryPOST, vocabularyPOST } from "@/routes";

export const RouterPOST = (req: Request): Promise<Response> | Response => {
  const router = req.url.split(prefixDefaultApi)[1];

  const routerMap = {
    categories: "categories",
    register: "auth",
    vocabulary: "vocabulary",
  };

  const routesDefine = router.split("/")[1];

  switch (routesDefine) {
    case routerMap.categories:
      return categoryPOST({ request: req, router });
    case routerMap.register:
      return authPOST({ request: req, router });
    case routerMap.vocabulary:
      return vocabularyPOST({ request: req, router });
    default:
      return new Response("Not Found", { status: HTTP_CODE_ERRORS.NOT_FOUND });
  }
};

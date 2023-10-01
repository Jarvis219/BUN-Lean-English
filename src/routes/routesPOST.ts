import { prefixDefaultApi } from "@/constants";
import { authPOST } from "@/routes/auth";
import { categoryPOST } from "@/routes/category";

export const RouterPOST = (req: Request): Promise<Response> | Response => {
  const router = req.url.split(prefixDefaultApi)[1];

  const routerMap = {
    categories: "categories",
    register: "auth",
  };

  const routesDefine = router.split("/")[1];

  switch (routesDefine) {
    case routerMap.categories:
      return categoryPOST({ request: req, router });
    case routerMap.register:
      return authPOST({ request: req, router });
    default:
      return new Response("Not Found", { status: 404 });
  }
};

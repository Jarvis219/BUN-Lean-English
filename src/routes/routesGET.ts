import { prefixDefaultApi } from "@/constants";
import { categoryGET } from "@/routes/category";

export const RouterGET = (req: Request): Response => {
  const router = req.url.split(prefixDefaultApi)[1];

  const categoriesRouter = "categories";

  const routesDefine = router.split("/")[1];

  switch (routesDefine) {
    case categoriesRouter:
      return categoryGET({ router });
    default:
      return new Response("Not Found", { status: 404 });
  }
};

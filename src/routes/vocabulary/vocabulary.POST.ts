import { HTTP_CODE_ERRORS, vocabularyRouter } from "@/constants";
import { createVocabulary, updateVocabulary } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { getRouter } from "@/utils";

interface IVocabularyRouter {
  request: Request;
  router: string;
}

const vocabularyPOST = ({ request, router }: IVocabularyRouter) => {
  switch (router) {
    case vocabularyRouter.default:
      return authMiddleware(request, (req: Request) => {
        return createVocabulary(req);
      });
    case getRouter(router, vocabularyRouter.id).routerMatch:
      return authMiddleware(request, (req: Request) =>
        updateVocabulary({
          request: req,
          params: {
            id: getRouter(router, vocabularyRouter.id).paramsResultObject.id,
          },
        })
      );

    default:
      return new Response("Not Found", { status: HTTP_CODE_ERRORS.NOT_FOUND });
  }
};

export { vocabularyPOST };

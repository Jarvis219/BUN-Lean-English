import { HTTP_CODE_ERRORS, vocabularyRouter } from "@/constants";
import { deleteVocabulary } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { getRouter } from "@/utils";

interface IVocabularyRouter {
  request: Request;
  router: string;
}

const vocabularyDELETE = ({ request, router }: IVocabularyRouter) => {
  switch (router) {
    case getRouter(router, vocabularyRouter.id).routerMatch:
      return authMiddleware(request, (req: Request) =>
        deleteVocabulary({
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

export { vocabularyDELETE };

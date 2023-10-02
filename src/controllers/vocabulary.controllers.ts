import { HTTP_CODE_ERRORS } from "@/constants";
import { Vocabulary } from "@/models";
import { isEmpty } from "@/utils";

export const createVocabulary = async (req: Request): Promise<Response> => {
  const body = await req.json();
  const userId = req.headers.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ message: "Missing userId" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  if (!body.categoryId) {
    return new Response(JSON.stringify({ message: "Missing categoryId" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  if (!body.word) {
    return new Response(JSON.stringify({ message: "Missing word" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  if (!body.meaning) {
    return new Response(JSON.stringify({ message: "Missing meaning" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  body.userId = userId;

  try {
    const vocabulary = new Vocabulary(body);
    const vocabularySaved = await vocabulary.save();
    return new Response(JSON.stringify(vocabularySaved));
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
};

export const getVocabulary = async (req: Request): Promise<Response> => {
  const userId = req.headers.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ message: "Missing userId" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  try {
    const vocabularies = await Vocabulary.find({ userId });
    return new Response(JSON.stringify(vocabularies));
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
};

interface IGetVocabularyById {
  request: Request;
  params: { id: string };
}
export const getVocabularyById = async ({
  request,
  params,
}: IGetVocabularyById): Promise<Response> => {
  const userId = request.headers.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ message: "Missing userId" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  try {
    const vocabulary = await Vocabulary.findOne({ userId, _id: params.id });
    return new Response(JSON.stringify(vocabulary));
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
};

export const updateVocabulary = async ({
  request,
  params,
}: IGetVocabularyById): Promise<Response> => {
  const userId = request.headers.get("userId");
  const body = await request.json();

  if (!userId) {
    return new Response(JSON.stringify({ message: "Missing userId" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  if (isEmpty(body)) {
    return new Response(JSON.stringify({ message: "Missing field" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  try {
    const vocabulary = await Vocabulary.findOneAndUpdate(
      { userId, _id: params.id },
      body,
      { new: true }
    );
    return new Response(JSON.stringify(vocabulary));
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
};

export const deleteVocabulary = async ({
  request,
  params,
}: IGetVocabularyById): Promise<Response> => {
  const userId = request.headers.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ message: "Missing userId" }), {
      status: HTTP_CODE_ERRORS.BAD_REQUEST,
    });
  }

  try {
    await Vocabulary.deleteOne({ userId, _id: params.id });
    return new Response(
      JSON.stringify({
        message: "Delete vocabulary successfully",
      })
    );
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
};

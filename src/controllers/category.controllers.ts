import { Category } from "@/models";
import { isEmpty } from "@/utils";

export const createCategory = async (req: Request): Promise<Response> => {
  const body = await req.json();
  const userId = req.headers.get("userId");

  if (isEmpty(body)) {
    return new Response(JSON.stringify({ message: "Missing field" }), {
      status: 400,
    });
  }

  if (!userId) {
    return new Response(JSON.stringify({ message: "Missing userId" }), {
      status: 400,
    });
  }

  body.userId = userId;

  // Check name category is exist
  const nameIsExit = await Category.findOne({ name: body.name });
  if (nameIsExit) {
    return new Response(JSON.stringify({ message: "Category name is exist" }), {
      status: 400,
    });
  }

  try {
    const category = new Category(body);
    const categorySaved = await category.save();
    return new Response(JSON.stringify(categorySaved));
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
};

interface IUpdateCategory {
  request: Request;
  params: { id: string };
}

export const updateCategory = async ({
  request,
  params,
}: IUpdateCategory): Promise<Response> => {
  const body = await request.json();

  if (isEmpty(body)) {
    return new Response(JSON.stringify({ message: "Missing field" }), {
      status: 400,
    });
  }

  try {
    const category = await Category.findByIdAndUpdate(
      {
        _id: params.id,
      },
      body,
      {
        new: true,
      }
    );
    return new Response(JSON.stringify(category));
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
};

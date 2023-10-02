import { HTTP_CODE_ERRORS, prefixDefaultApi } from "@/constants";
import { RouterGET, RouterPOST } from "@/routes";
import mongoose from "mongoose";

Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req: Request) {
    const prefixUrl = req.url.split("/")[3];

    //  connect to database mongodb
    await mongoose
      .connect(process.env.MONGODB_URI as string)
      .then(() => console.log("DB Connected"));

    //  handle error connect to database mongodb
    mongoose.connection.on("error", (err) => {
      throw new Error(`DB connection error: ${err.message}`);
    });

    if (prefixUrl !== prefixDefaultApi)
      return new Response("Not Found", { status: HTTP_CODE_ERRORS.NOT_FOUND });

    switch (req.method) {
      case "GET":
        return RouterGET(req);
      case "POST":
        return RouterPOST(req);
      default:
        return new Response("Not Found", {
          status: HTTP_CODE_ERRORS.NOT_FOUND,
        });
    }
  },
});

import { FastifyInstance } from "fastify";
import { WordController } from "../controller/word.controller.js";
import { getWordSchema, getWordsListSchema } from "@/infrastructure/swagger/definitions/word.js";


const wordRoutes = async (app: FastifyInstance) => {
    app.addHook("preValidation", app.authenticate);

    app.get("/en", { schema: getWordsListSchema }, WordController.getWordsList);
    app.get("/en/:wordId", { schema: getWordSchema }, WordController.getWord);

};

export default wordRoutes;
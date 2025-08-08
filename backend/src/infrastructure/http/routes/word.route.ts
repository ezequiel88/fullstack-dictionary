import { FastifyInstance } from "fastify";
import { WordController } from "../controller/word.controller.js";


const wordRoutes = async (app: FastifyInstance) => {
    app.addHook("preValidation", app.authenticate);

    app.get("/en", WordController.getWordsList);
    app.get("/en/:wordId", WordController.getWord);

};

export default wordRoutes;
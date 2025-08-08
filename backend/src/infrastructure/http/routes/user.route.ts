import { FastifyInstance } from "fastify";
import { UserController } from "../controller/user.controller.js";

const userRoutes = async (app: FastifyInstance) => {
    app.addHook("preValidation", app.authenticate);

    app.get("/me", UserController.getProfile);
    app.get("/me/history", UserController.getHistory);
    app.get("/me/favorites", UserController.getFavorites);
    app.post("/me/:wordId/favorite", UserController.markFavorite);
    app.delete("/me/:wordId/unfavorite", UserController.unmarkFavorite);
};

export default userRoutes;
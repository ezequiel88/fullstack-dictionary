import { FastifyInstance } from "fastify";
import { UserController } from "@/infrastructure/http/controller/user.controller.js";
import { getFavoritesSchema, getHistorySchema, getProfileSchema, markFavoriteSchema, unmarkFavoriteSchema } from "@/infrastructure/swagger/definitions/user.js";


const userRoutes = async (app: FastifyInstance) => {
    app.addHook("preValidation", app.authenticate);

    app.get("/me", { schema: getProfileSchema }, UserController.getProfile);
    app.get("/me/history", { schema: getHistorySchema }, UserController.getHistory);
    app.get("/me/favorites", { schema: getFavoritesSchema }, UserController.getFavorites);
    app.post("/me/:wordId/favorite", { schema: markFavoriteSchema }, UserController.markFavorite);
    app.delete("/me/:wordId/unfavorite", { schema: unmarkFavoriteSchema }, UserController.unmarkFavorite);

};

export default userRoutes;
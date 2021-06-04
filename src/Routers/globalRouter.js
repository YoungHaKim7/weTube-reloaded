import express from "express";
import { join } from "../controllers/userController";
import { home } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/join", join)
globalRouter.get("/", home);

export default globalRouter;
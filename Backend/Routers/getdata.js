// routes/campaignRoutes.js
import express from "express";
import { getCampaignHistory } from "../Controllers/campaignController.js";

const getRouter = express.Router();

getRouter.get("/campaigns/history", getCampaignHistory);

export default getRouter;

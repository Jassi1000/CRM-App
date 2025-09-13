import express from "express";
import { isLoggedIn } from "../Middleware/protect.js";
import { getSegmentedEmails } from "../Controllers/segmentController.js";
import { launchCampaign } from "../Controllers/campaignController.js";

const createRouter = express.Router();

// Protect + handle file upload
createRouter.post("/createSegment", isLoggedIn,getSegmentedEmails);
createRouter.post("/launch-campaign", isLoggedIn,launchCampaign);

export default createRouter;

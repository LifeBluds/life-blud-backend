import express, { Router } from "express";
import { getRequests, getDonors, requestDonor } from "../controllers";
import { authMiddleware, authorizeFacility } from "../middleware";

const router: Router = express.Router();

router.get("/get-donors", authMiddleware, authorizeFacility, getDonors);
router.post(
  "/request-donor/:donorId",
  authMiddleware,
  authorizeFacility,
  requestDonor,
);
router.get("/get-requests", authMiddleware, authorizeFacility, getRequests);

export { router as facilityRoute };

import express, { Router } from "express";
import { getRequests, getDonors, requestDonor } from "../controllers";
import { authMiddleware, authorizeFacility, profileCheck } from "../middleware";

const router: Router = express.Router();

router.get(
  "/get-donors",
  authMiddleware,
  authorizeFacility,
  profileCheck,
  getDonors,
);
router.post(
  "/request-donor/:donorId",
  authMiddleware,
  authorizeFacility,
  profileCheck,
  requestDonor,
);
router.get(
  "/get-requests",
  authMiddleware,
  authorizeFacility,
  profileCheck,
  getRequests,
);

export { router as facilityRoute };

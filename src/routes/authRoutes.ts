import express, { Router } from "express";
import {
  completeDonorProfile,
  completeFacilityProfile,
  login,
  lookUpMail,
  registerDonor,
  registerFacility,
  verifyEmailAddress,
} from "../controllers/authController";
import { authMiddleware, validateEmailToken } from "../middleware";

const router: Router = express.Router();

router.post("/look-up", lookUpMail);
router.post("/onboard-donor", registerDonor);
router.post("/complete-donor-profile", authMiddleware, completeDonorProfile);
router.post("/onboard-facility", registerFacility);
router.post(
  "/complete-facility-profile",
  authMiddleware,
  completeFacilityProfile,
);
router.post("/login", login);
router.get("/verify-email/:token", validateEmailToken, verifyEmailAddress);

export { router as authRoute };

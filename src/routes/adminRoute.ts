import express, { Router } from "express";
import {
  getUnverifiedFacilities,
  loginAdmin,
  rejectFacility,
  verifyFacility,
} from "../controllers";
import { authMiddleware, authorizeAdmin } from "../middleware";

const router: Router = express.Router();

router.post("/login", loginAdmin);

router.get(
  "/unverified-facilities",
  authMiddleware,
  authorizeAdmin,
  getUnverifiedFacilities,
);
router.patch(
  "/verify-facility/:facilityId",
  authMiddleware,
  authorizeAdmin,
  verifyFacility,
);
router.post(
  "/reject-facility/:facilityId",
  authMiddleware,
  authorizeAdmin,
  rejectFacility,
);

export { router as adminRoute };

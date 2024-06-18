import express, { Router } from "express";
import { fetchRequests, acceptRequest, rejectRequest } from "../controllers";
import { authMiddleware, profileCheck, authorizeDonor } from "../middleware";

const router: Router = express.Router();

router.get(
  "/get-requests",
  authMiddleware,
  authorizeDonor,
  profileCheck,
  fetchRequests,
);
router.post(
  "/accept-request/:requestId",
  authMiddleware,
  authorizeDonor,
  profileCheck,
  acceptRequest,
);
router.post(
  "/reject-request/:requestId",
  authMiddleware,
  authorizeDonor,
  profileCheck,
  rejectRequest,
);

export { router as donorRoute };

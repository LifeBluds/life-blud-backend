import express, { Router } from "express";
import { lookUpMail, registerDonor } from "../controllers/authController";

const router: Router = express.Router();

router.post("/look-up", lookUpMail);
router.post("/onboard-donor", registerDonor);

export { router as authRoute };

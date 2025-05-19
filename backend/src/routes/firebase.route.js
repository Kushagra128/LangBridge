import express from "express";
import { upsertFirebaseUser } from "../controllers/firebase.controller.js";

const router = express.Router();

// POST /api/auth/firebase
router.post("/", upsertFirebaseUser);

export default router;

import express from 'express';
import { createUrl, redirectUrl, getUrlStats } from '../controllers/urlController.js';


const router = express.Router();

// create short url
router.post("/shorten", createUrl);

// redirect
router.get("/:shortCode", redirectUrl);

// analytics
router.get("/:shortCode/stats", getUrlStats);

export default router;

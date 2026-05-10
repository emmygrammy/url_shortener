import express from 'express';
import { createUrl, redirectUrl, getUrlStats, updateUrl, deleteUrl } from '../controllers/urlController.js';
import { validateUrlInput } from '../middleware/validateInput.js';



const router = express.Router();

// create short url
router.post("/shorten", validateUrlInput, createUrl);

// analytics
router.get("/:shortCode/stats", getUrlStats);
// redirect
router.get("/:shortCode", redirectUrl);

// analytics
router.get("/:shortCode/stats", getUrlStats);

// update url
router.put("/:shortCode", validateUrlInput, updateUrl);

// delete url
router.delete("/:shortCode", deleteUrl);

export default router;

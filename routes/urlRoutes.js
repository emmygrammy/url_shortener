import express from 'express';
import { createUrl, getAllUrls, redirectUrl, getUrlStats, updateUrl, deleteUrl } from '../controllers/urlController.js';
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

// get all urls
router.get("/", getAllUrls);

// update url
router.put("/:shortCode", validateUrlInput, updateUrl);

// delete url
router.delete("/:shortCode", deleteUrl);


console.log("URL ROUTES FILE LOADED");

router.stack.forEach(r => {
  if (r.route) {
    console.log("ROUTE:", Object.keys(r.route.methods), r.route.path);
  }
});

router.use((req, res, next) => {
  console.log("🔥 REQUEST:", req.method, req.url);
  next();
});

export default router;

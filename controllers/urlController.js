import Url from '../models/urlModel.js';
import { nanoid } from "nanoid";
import ClickEvent from "../models/analyticsModel.js";
import requestIp from "request-ip";
import geoip from "geoip-lite";

//create url
export const createUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "URL is required" });
    }

    // prevent duplicates
    const existing = await Url.findOne({ originalUrl });

    if (existing) {
      return res.status(200).json({
        message: "URL already exists",
        data: existing,
      });
    }

    const id = nanoid();
    console.log(id);
    const shortCode = nanoid(7);

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
    });

    res.status(201).json({
      message: "URL created successfully",
      shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
      data: newUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//redirect url
export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find URL
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    // Get user IP
    const ip = requestIp.getClientIp(req);

    // Get geo info
    const geo = geoip.lookup(ip);

    // Check recent duplicate click
    const existingClick = await ClickEvent.findOne({
      urlId: url._id,
      ipAddress: ip,
      clickedAt: {
        $gte: new Date(Date.now() - 30000), // 30 seconds
      },
    });

    // Count only unique recent clicks
    if (!existingClick) {

      // Increment click count
      await Url.updateOne(
        { _id: url._id },
        {
          $inc: { clicks: 1 },
        }
      );

      // Save analytics
      await ClickEvent.create({
        urlId: url._id,
        ipAddress: ip,
        userAgent: req.headers["user-agent"],
        referrer: req.headers.referer || null,

        country: geo?.country || "Unknown",
        city: geo?.city || "Unknown",

        clickedAt: new Date(),
      });
    }

    // Redirect
    return res.redirect(url.originalUrl);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// get all urls
export const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });

    if (!urls || urls.length === 0) {
      return res.status(404).json({
        message: "No URLs found"
      });
    }

    return res.status(200).json({
      message: "URLs retrieved successfully",
      count: urls.length,
      data: urls
    });

  } catch (error) {
    console.error("Get all URLs error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

//get url stats
export const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    const clicks = await ClickEvent.countDocuments({
      urlId: url._id,
    });

    const recentClicks = await ClickEvent.find({ urlId: url._id })
      .sort({ clickedAt: -1 })
      .limit(10);

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      totalClicks: clicks,
      recentClicks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// update url
export const updateUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { originalUrl } = req.body;

    // Find URL
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    // Update URL
    url.originalUrl = originalUrl || url.originalUrl;

    await url.save();

    return res.status(200).json({
      message: "URL updated successfully",
      data: url,
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// delete url
export const deleteUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // 1. Validate input FIRST
    if (!shortCode || shortCode.trim() === "") {
      return res.status(400).json({
        message: "shortCode is required",
      });
    }

    // 2. Find URL
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    // 3. Delete analytics first (cleanup)
    await ClickEvent.deleteMany({ urlId: url._id });

    // 4. Delete URL
    await Url.findByIdAndDelete(url._id);

    return res.status(200).json({
      message: "URL deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
import Url from '../models/urlModel.js';
import { nanoid } from "nanoid";
import ClickEvent from "../models/analyticsModel.js";



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
      shortUrl: `https://yourdomain.com/${shortCode}`,
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

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    // 1. FAST CLICK COUNTER UPDATE (atomic)
    await Url.updateOne(
      { _id: url._id },
      { $inc: { clicks: 1 } }
    );

    // 2. ASYNC analytics logging (do NOT block redirect)
    ClickEvent.create({
      urlId: url._id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers.referer || null,
      country: "NG", // later upgrade with geoIP
      clickedAt: new Date(),
    }).catch(err => console.log("Analytics error:", err));

    // 3. IMMEDIATE REDIRECT (performance-critical)
    return res.redirect(url.originalUrl);

  } catch (error) {
    return res.status(500).json({ error: error.message });
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


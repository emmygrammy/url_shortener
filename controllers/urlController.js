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

    // Check if same IP clicked recently
    const existingClick = await ClickEvent.findOne({
      urlId: url._id,
      ipAddress: req.ip,
      clickedAt: {
        $gte: new Date(Date.now() - 30000), // 30 seconds
      },
    });

    // Only count unique recent click
    if (!existingClick) {
      // Increment clicks
      await Url.updateOne(
        { _id: url._id },
        { $inc: { clicks: 1 } }
      );

      // Save analytics
      await ClickEvent.create({
        urlId: url._id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        referrer: req.headers.referer || null,
        country: "NG",
        clickedAt: new Date(),
      });
    }

    // Redirect user
    return res.redirect(url.originalUrl);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
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


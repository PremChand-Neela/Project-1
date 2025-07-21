import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET: Channel stats (total views, subscribers, videos, likes)
const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const [totalViews, totalSubscribers, totalVideos, totalLikes] = await Promise.all([
        Video.aggregate([
            { $match: { owner: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, views: { $sum: "$views" } } }
        ]),
        Subscription.countDocuments({ channel: userId }),
        Video.countDocuments({ owner: userId }),
        Like.countDocuments({ likedBy: userId })
    ]);

    const stats = {
        totalViews: totalViews[0]?.views || 0,
        totalSubscribers: totalSubscribers || 0,
        totalVideos: totalVideos || 0,
        totalLikes: totalLikes || 0
    };

    res.status(200).json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

// GET: Videos uploaded by this user
const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .select("-__v")
        .populate("owner", "username avatar");

    res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export {
    getChannelStats,
    getChannelVideos
};

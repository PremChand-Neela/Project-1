import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Video unliked"));
    }

    await Like.create({ video: videoId, likedBy: userId });
    return res.status(201).json(new ApiResponse(201, null, "Video liked"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Comment unliked"));
    }

    await Like.create({ comment: commentId, likedBy: userId });
    return res.status(201).json(new ApiResponse(201, null, "Comment liked"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Tweet unliked"));
    }

    await Like.create({ tweet: tweetId, likedBy: userId });
    return res.status(201).json(new ApiResponse(201, null, "Tweet liked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const likedVideos = await Like.find({ likedBy: userId, video: { $ne: null } })
        .populate("video")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}

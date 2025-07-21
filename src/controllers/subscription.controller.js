import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle subscription: subscribe if not subscribed, unsubscribe if already
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    if (channelId === String(subscriberId)) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const existingSub = await Subscription.findOne({
        channel: channelId,
        subscriber: subscriberId,
    });

    let message;
    if (existingSub) {
        // Already subscribed → Unsubscribe
        await existingSub.deleteOne();
        message = "Unsubscribed successfully";
    } else {
        // Not subscribed → Subscribe
        await Subscription.create({
            channel: channelId,
            subscriber: subscriberId,
        });
        message = "Subscribed successfully";
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, message));
});

// Get all subscribers for a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username fullName avatar");

    return res.status(200).json(
        new ApiResponse(200, subscribers, "List of subscribers")
    );
});

// Get all channels a user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const channels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username fullName avatar");

    return res.status(200).json(
        new ApiResponse(200, channels, "List of subscribed channels")
    );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, {
            status: "OK",
            timestamp: new Date().toISOString(),
            message: "Server is healthy 🚀"
        })
    );
});

export { healthcheck };

import { Router } from "express";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/video/:videoId").get(getVideoComments).post(addComment);
router.route("/:commentId").patch(updateComment).delete(deleteComment);

export default router;

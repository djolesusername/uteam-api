import { Router } from "express";
import profileControls from "../controllers/profileController";
import { check } from "express-validator";
import User from "../models/User";
import passport from "passport";

const requireAuth = passport.authenticate("jwt", { session: false });

const router = Router();

router.get("/", profileControls.getAllProfiles);
router.get("/:uid", profileControls.getProfilebyId);

router.put(
    "/:id",
    check("name").notEmpty().withMessage("Name is needed"),
    check("profilePhoto").optional().isURL(),
    check("id").custom(async (value) => {
        const user = await User.findOne({ where: { id: value } });
        if (!user) {
            return Promise.reject(
                "User not found - profile cannot be accessed"
            );
        }
    }),
    requireAuth,
    profileControls.updateProfile
);

router.delete("/:uid", requireAuth, profileControls.deleteProfile);

export default router;

import { Router } from "express";
import profileControls from "../controllers/profileController";
import { check } from "express-validator";
import User from "../models/User";
//const myData: object[] = []

const router = Router();

router.get("/", profileControls.getAllProfiles);
router.get("/:uid", profileControls.getProfilebyId);

router.post(
    "/:id",
    check("name").notEmpty().withMessage("Name is needed"),
    check("profilePhoto").isURL(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    check("id").custom(async (value, { req }) => {
        const user = await User.findOne({ where: { id: value } });
        if (!user) {
            return Promise.reject("User not found - profile cannot be created");
        }
    }),
    profileControls.postAddProfile
);

//Authorization logic needed
router.put(
    "/:id",
    check("name").notEmpty().withMessage("Name is needed"),
    check("profilePhoto").isURL(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    check("id").custom(async (value, { req }) => {
        const user = await User.findOne({ where: { id: value } });
        if (!user) {
            return Promise.reject(
                "User not found - profile cannot be accessed"
            );
        }
    }),
    profileControls.updateProfile
);

//Authorization logic needed
router.delete("/:uid", profileControls.deleteProfile);
export default router;

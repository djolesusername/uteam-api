import { Router } from "express";
import companyControls from "../controllers/companiesController";
import { check } from "express-validator";

const router = Router();

router.get("/", companyControls.getCompanies);
router.get("/:uid", companyControls.getCompanybyId);

/*router.post(
    "/",
     check("name").notEmpty().withMessage("Name is needed").matches(/^[a-zA-Z0-9 ]+$/i),
    check("logo").isURL(),
   
    
    companyControls.addCompany
);*/

//Authorization logic needed
router.put(
    "/:id",
    check("name")
        .notEmpty()
        .withMessage("Name is needed")
        .matches(/^[a-zA-Z0-9 ]+$/i),

    check("logo").isURL(),

    companyControls.updateCompany
);

//Authorization logic needed
router.delete("/:uid", companyControls.deleteCompany);

export default router;

import { Router } from "express";
import { getAssignationReasons, newAssignationReason, alterAssignationReason } from "../controllers/EMT_dim_AssignationReason.controller.js";
import { getTypes, newType, alterTypeCurrent } from "../controllers/EMT_dim_AssignmentType.controller.js";
import { getYears, newYear, alterYearCurrent } from "../controllers/EMT_dim_Years.controller.js";
import { getIndepence, newIndepence, alterIndepenceCurrent } from "../controllers/EMT_dim_IndepenceRisk.controller.js";
import { getSS, newSS, alterSSCurrent } from "../controllers/EMT_dim_SecondReviewerRequiered.controller.js";
import { getAllBU, getBU, getSegment, getOffice, newBU, alterBUCurrent } from "../controllers/EMT_dim_BU.controller.js";
import {getSectorTypes, getSectorTypesParent} from "../controllers/EMT_dim_SectorType.controller.js";

const router = Router();

router.get("/EMT_dim_AssignationReason", getAssignationReasons);
router.get("/EMT_dim_AssignmentType", getTypes);
router.get("/EMT_dim_Years", getYears);
router.get("/EMT_dim_IndepenceRisk", getIndepence);
router.get("/EMT_dim_SecondReviewerRequiered", getSS);
router.get("/EMT_dim_BU", getAllBU);
router.get("/EMT_dim_BU/BU", getBU);
router.get("/EMT_dim_BU/Segment", getSegment);
router.get("/EMT_dim_BU/Office", getOffice);
router.get("/EMT_dim_SectorType", getSectorTypes);
router.get("/EMT_dim_SectorType/Parent", getSectorTypesParent);

router.post("/EMT_dim_AssignationReason", newAssignationReason);
router.post("/EMT_dim_AssignmentType", newType);
router.post("/EMT_dim_Years", newYear);
router.post("/EMT_dim_IndepenceRisk", newIndepence);
router.post("/EMT_dim_SecondReviewerRequiered", newSS);
router.post("/EMT_dim_BU", newBU);

router.put("/EMT_dim_AssignationReason/:EMT_Reason_ID", alterAssignationReason);
router.put("/EMT_dim_AssignmentType/:EMT_Assignment_ID", alterTypeCurrent);
router.put("/EMT_dim_Years/:EMT_FY_ID", alterYearCurrent);
router.put("/EMT_dim_IndepenceRisk/:EMT_Indepence_ID", alterIndepenceCurrent);
router.put("/EMT_dim_SecondReviewerRequiered/:EMT_SSRequi_ID", alterSSCurrent);
router.put("/EMT_dim_BU/:EMT_BU_PK", alterBUCurrent);

export default router;
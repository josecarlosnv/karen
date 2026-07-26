import { Router } from "express";
import { getCredencials, newCredencial, getCredencialByID, alterCredencialCurrent } from "../controllers/EMT_tbl_Credentials.controller.js";
import { getAssigns, newAssign, getAssignByID, alterAssignCurrent } from "../controllers/EMT_tbl_Assignment.controller.js";
import { getAssignApprs, newAssignAppr, getAssignApprByID, alterAssignApprCurrent } from "../controllers/EMT_tbl_ActivesApprobals.controller.js";
import { getCredencialsApprs, newCredencialAppr, getCredencialApprByID } from "../controllers/EMT_tbl_CredentialsApprovals.controller.js";
import { getOthersEQCR, newOtherEQCR, getOtherEQCRByID, alterOtherEQCRCurrent } from "../controllers/EMT_tbl_OthersEQCR.controller.js";
import { getPICReass, newPICReass, getPICReassByID, alterPICReassCurrent } from "../controllers/EMT_tbl_PICReassigns.controller.js";
import { alterFormCurrent, getForm, getFormbyID, newForm } from "../controllers/EMT_tbl_Form.controller.js";
import { alterReappointCurrent, getReappoint, getReappointByID, newReappoint } from "../controllers/EMT_tbl_Reappoint.controller.js";
//import { alterSecurity, getSecurity, getSecurityByEmail, newSecurity } from "../controllers/EMT_tbl_Security.controller.js";//Esto existia antes de que yo isaac moviera algo aqui
import { 
  alterSecurity, 
  getSecurity, 
  getSecurityByEmail, 
  newSecurity,
  authAD,
  getClaims
} from "../controllers/EMT_tbl_Security.controller.js";//By Isaac
import { getCredentialsGenerated, 
  alterCredentialsGenerated, 
  getCredentialsGeneratedById, 
  newCredentialsGenerated, 
  approveCredentialsGenerated,
   getCredentialsGeneratedReady,
   getCredentialsEQCR,
   getCredentialSummaryByEmployeeId
} from "../controllers/EMT_tbl_CredentialsGenerated.controller.js";
import { getColabsGenerated, 
  alterColabCurrent, 
  getColabByEmployeeID, 
  newColabGenerated, 
  getColabsGeneratedActives,
  getColabsGeneratedLead,
  getColabsGeneratedAsistant
 } from "../controllers/EMT_tbl_ColabsGenerated.controller.js";
import { getReappointHistoric } from "../controllers/EMT_tbl_ReappointHistoric.controller.js";
import { newAssignmentBasicInformation,DeleteAssignmentBasicInformation } from "../controllers/EMT_tbl_AssignmentsBasicInformation.js";
import { newAssignmentValidationCriteria ,
  getAssignmentValidationCriteriaById
} from "../controllers/EMT_tbl_AssignmentsValidationCriteria.js";
import { GetAssigmentsGenerated ,
  GetAssignmentGeneratedById,getAssignmentsApprovals} from "../controllers/EMT_tbl_AssignmentsGenerated.js";
import{getDashboardKPIs,getEQCRDashboardLink} from "../controllers/EMT_GetDashboardKPIS.js"
import {newAssignmentsApproval,getAssignmentsApprovalsByKey} from "../controllers/EMT_tbl_AssigmentsApprovals.js"
import { getNotifications} from "../controllers/ETM_Notifications.js"
const router = Router();

router.use(authAD);

router.get("/EMT_tbl_Assignment", getAssigns);
router.get("/EMT_tbl_ActivesApprobals", getAssignApprs);
router.get("/EMT_tbl_Credentials", getCredencials);
router.get("/EMT_tbl_CredentialsApprobals", getCredencialsApprs);
router.get("/EMT_tbl_Form", getForm);
router.get("/EMT_tbl_OthersEQCR", getOthersEQCR);
router.get("/EMT_tbl_PICReassigns", getPICReass);
router.get("/EMT_tbl_Reappoint", getReappoint);
router.get("/EMT_tbl_Security", getSecurity);
router.get("/auth/claims", getClaims);// By Isaac
router.get("/EMT_tbl_CredentialsGenerated", getCredentialsGenerated);
router.get("/EMT_tbl_CredentialsGenerated/getCredentialsEQCR", getCredentialsEQCR);
router.get("/EMT_tbl_CredentialsGenerated/getColabsGeneratedLead", getColabsGeneratedLead);
router.get("/EMT_tbl_ColabsGenerated", getColabsGenerated);
router.get("/EMT_tbl_ColabsGenerated/Actives", getColabsGeneratedActives);  
router.get("/EMT_tbl_ColabsGenerated/getColabsGeneratedAsistant", getColabsGeneratedAsistant);  
router.get("/EMT_tbl_CredentialsGenerated/Ready", getCredentialsGeneratedReady);
router.get("/EMT_tbl_CredentialsGenerated/getCredentialSummaryByEmployeeId/:Employee_ID", getCredentialSummaryByEmployeeId);
router.get("/EMT_tbl_ReappointHistoric", getReappointHistoric);
router.get("/EMT_tbl_AssignmentsGenerated/GetAssigmentsGenerated", GetAssigmentsGenerated);
router.get("/EMT_tbl_AssignmentsGenerated/getAssignmentsApprovals", getAssignmentsApprovals);
router.get("/EMT_tbl_AssignmentsGenerated/GetAssignmentGeneratedById/:id",GetAssignmentGeneratedById);
router.get("/EMT_tbl_AssignmetsValidationCriteria/getAssignmentValidationCriteriaById/:Key_EMT", getAssignmentValidationCriteriaById);
router.get("/EMT_GetDashboardKPIS", getDashboardKPIs);
router.get("/EMT_Notifications", getNotifications);
router.get("/EMT_GetDashboardKPIS/getEQCRDashboardLink", getEQCRDashboardLink);
router.get("/EMT_tbl_AssignmentsApprovals/:Key_EMT", getAssignmentsApprovalsByKey);


router.post("/EMT_tbl_Assignment", newAssign);
router.post("/EMT_tbl_ActivesApprobals", newAssignAppr);
router.post("/EMT_tbl_Credentials", newCredencial);
router.post("/EMT_tbl_Credentials/delete", alterCredencialCurrent);//para "Borrar"
router.post("/EMT_tbl_CredentialsApprobals", newCredencialAppr);
router.post("/EMT_tbl_Form", newForm);
router.post("/EMT_tbl_OthersEQCR", newOtherEQCR);
router.post("/EMT_tbl_PICReassigns", newPICReass);
router.post("/EMT_tbl_Reappoint", newReappoint);
router.post("/EMT_tbl_Security", newSecurity);
router.post("/EMT_tbl_CredentialsGenerated", newCredentialsGenerated);
router.post("/EMT_tbl_ColabsGenerated", newColabGenerated);
router.post("/EMT_tbl_AssignmetsBasicInformation", newAssignmentBasicInformation);
router.post("/EMT_tbl_AssignmetsBasicInformation/DeleteAssignmentBasicInformation", DeleteAssignmentBasicInformation);
router.post("/EMT_tbl_AssignmetsValidationCriteria", newAssignmentValidationCriteria);
router.post("/EMT_tbl_AssignmentsApprovals",newAssignmentsApproval);

router.get("/EMT_tbl_Assignment/:EMTAssign_PK", getAssignByID);
router.get("/EMT_tbl_ActivesApprobals/:EMTActivAppr_PK", getAssignApprByID);
router.get("/EMT_tbl_Credentials/:EMTCredent_PK", getCredencialByID);
router.get("/EMT_tbl_CredentialsApprobals/:EMT_CredAppr_PK", getCredencialApprByID);
router.get("/EMT_tbl_Form/:Key_EMT",getFormbyID);
router.get("/EMT_tbl_OthersEQCR/:EMT_Employee_ID", getOtherEQCRByID);
router.get("/EMT_tbl_PICReassigns/:EMTPICReassig_PK", getPICReassByID);
router.get("/EMT_tbl_Reappoint/:EMTReapp_PK", getReappointByID);
router.get("/EMT_tbl_Security/:Email_Address_Business", getSecurityByEmail);
router.get("/EMT_tbl_CredentialsGenerated/:Employee_ID", getCredentialsGeneratedById);
router.get("/EMT_tbl_ColabsGenerated/:Employee_ID", getColabByEmployeeID);

router.put("/EMT_tbl_Assignment/:EMTAssign_PK", alterAssignCurrent);
router.put("/EMT_tbl_ActivesApprobals/:EMTActivAppr_PK", alterAssignApprCurrent);
//router.put("/EMT_tbl_CredentialsApprobals/:EMT_CredAppr_PK", alterCredencialApprCurrent);
router.put("/EMT_tbl_Form/:EMTForm_PK", alterFormCurrent);
router.put("/EMT_tbl_OthersEQCR/:EMT_Employee_ID", alterOtherEQCRCurrent);
router.put("/EMT_tbl_PICReassigns/:EMTPICReassig_PK", alterPICReassCurrent);
router.put("/EMT_tbl_Reappoint/:EMTReapp_PK", alterReappointCurrent);
router.put("/EMT_tbl_Security/:EMTSecurity_PK", alterSecurity);
router.put("/EMT_tbl_CredentialsGenerated/:Employee_ID", alterCredentialsGenerated);
router.put("/EMT_tbl_CredentialsGenerated/Approve/:Employee_ID", approveCredentialsGenerated);
router.put("/EMT_tbl_ColabsGenerated/:Employee_ID", alterColabCurrent);

export default router;
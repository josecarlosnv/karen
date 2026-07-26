import { Router } from "express";
import { getvwColabsByID, getvwColabsFilterAct, getvwColabsAll, getvwColabsPD, getvwColabsSM, getvwColabsLocalJobName } from "../controllers/vw_EMT_Colabs.controller.js";
import { getvwEntities, getvwEntiteByID } from "../controllers/vw_Entities.controller.js";
import { getvwReapp, getvwReappByBU, getvwReappByCreatedBy, getvwReappvByID } from "../controllers/vw_EMT_Reappoints.controller.js";
import { getvwAssi, getvwAssiByBU, getvwAssiByCreatedBy, getvwAssiByKeyEMT } from "../controllers/vw_EMT_Assigns.controller.js";
import { getvwCred, getvwCredByBU, getvwCredByCreatedBy, getvwCredByEmployeeID } from "../controllers/vw_EMT_Credencials.controller.js";
import { getvwActiv, getvwActivByBU, getvwActivByCreatedBy, getvwActivByID } from "../controllers/vw_EMT_Actives.controller.js";
import { getvwReappHistoric, getvwReappHistoricByID } from "../controllers/vw_EMT_ReappointHistoric.controller.js";

const router = Router();

router.get("/vw_EMT_Actives", getvwActiv);
router.get("/vw_EMT_Actives/:Key_EMT", getvwActivByID);
router.get("/vw_EMT_Actives/Created_By/:Created_By", getvwActivByCreatedBy);
router.get("/vw_EMT_Actives/BU/:BU", getvwActivByBU);

router.get("/vw_EMT_Assign", getvwAssi);
router.get("/vw_EMT_Assign/:Key_EMT", getvwAssiByKeyEMT);
router.get("/vw_EMT_Assign/Created_By/:Created_By", getvwAssiByCreatedBy);
router.get("/vw_EMT_Assign/BU/:BU", getvwAssiByBU);

router.get("/vw_EMT_Reappoint", getvwReapp);
router.get("/vw_EMT_Reappoint/:Key_EMT", getvwReappvByID);
router.get("/vw_EMT_Reappoint/Created_By/:Created_By", getvwReappByCreatedBy);
router.get("/vw_EMT_Reappoint/BU/:BU", getvwReappByBU);

router.get("/vw_EMT_Credencials", getvwCred);
router.get("/vw_EMT_Credencials/:Employee_ID", getvwCredByEmployeeID);
router.get("/vw_EMT_Credencials/Created_By/:Created_By", getvwCredByCreatedBy);
router.get("/vw_EMT_Credencials/BU/:BU", getvwCredByBU);

router.get("/vw_EMT_Colabs", getvwColabsAll);
router.get("/vw_EMT_Colabs/PartnersDirecs", getvwColabsPD);
router.get("/vw_EMT_Colabs/SeniorManagers", getvwColabsSM);
router.get("/vw_EMT_Colabs/Activos", getvwColabsFilterAct);
router.get("/vw_EMT_Colabs/LocalJobName", getvwColabsLocalJobName);
router.get("/vw_EMT_Colabs/Employee_ID/:Employee_ID", getvwColabsByID);

router.get("/vw_Entities", getvwEntities);
router.get("/vw_Entities/:EntityID", getvwEntiteByID);

router.get("/vw_EMT_ReappointHistoric", getvwReappHistoric);
router.get("/vw_EMT_ReappointHistoric/:Key_EMT", getvwReappHistoricByID);

export default router;
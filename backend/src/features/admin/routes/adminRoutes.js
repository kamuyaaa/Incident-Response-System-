const express = require("express");
const {
  getIncidentsQueue,
  getResponders,
  assignResponder,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/incidents/queue", getIncidentsQueue);
router.get("/responders", getResponders);
router.patch("/incidents/:incidentId/assign", assignResponder);

module.exports = router;
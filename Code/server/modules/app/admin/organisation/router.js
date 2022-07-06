const handlers = require("./handlers");
const express = require("express");

const router = express.Router();

router.get("/admin/organisations", [
    handlers.checkUserAuthenticated,
    handlers.getListOrganisation,
]);

module.exports = router;

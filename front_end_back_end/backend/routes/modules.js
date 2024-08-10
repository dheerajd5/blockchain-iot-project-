const express = require("express");
const router = express.Router();

const {getComp1, getComp2, getComp3, getComp4, getComp5} = require("../controller/module")


router.get("/comp1", getComp1);
router.get("/comp2", getComp2);
router.get("/comp3", getComp3);
router.get("/comp4", getComp4);
router.get("/comp5", getComp5);

module.exports = router;

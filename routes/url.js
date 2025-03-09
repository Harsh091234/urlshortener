const express = require("express");
const {handleGenerateNewUser, handleGetAnalytics} = require("../controllers/url")
const router = express.Router();

router.post("/", handleGenerateNewUser);
router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
  

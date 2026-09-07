const express = require("express");
const router = express.Router();
const keywordController = require("../controllers/keywordController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, keywordController.addKeyword);
router.get("/", authMiddleware, keywordController.getKeyword);
router.delete("/:keywordId", authMiddleware, keywordController.deleteKeyword);

module.exports = router;

const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, boardController.updateBoards);
router.get("/", authMiddleware, boardController.getBoards);
module.exports = router;

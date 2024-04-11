var express = require("express");
var router = express.Router();
var tokenHandler = require("../../middleware/tokenHandler");
var noteController = require("../../controllers/noteController");

router.post("/note", tokenHandler.verifyAccessToken, noteController.create);
router.get(
  "/notes",
  tokenHandler.verifyAccessToken,
  noteController.getAllByUserId
);
router.get(
  "/note/:noteId",
  tokenHandler.verifyAccessToken,
  noteController.getOne
);
router.put(
  "/note/:noteId",
  tokenHandler.verifyAccessToken,
  noteController.update
);
router.delete(
  "/note/:noteId",
  tokenHandler.verifyAccessToken,
  noteController.delete
);
router.get("/search", tokenHandler.verifyAccessToken, noteController.search);

module.exports = router;

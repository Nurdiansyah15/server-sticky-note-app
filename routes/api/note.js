var express = require("express");
var router = express.Router();
var noteController = require("../../controllers/noteController");

/* CREATE a note. */
router.post("/note", noteController.create);
router.get("/notes", noteController.getAll);
router.get("/note/:noteId", noteController.getOne);
router.put("/note/:noteId", noteController.update);
router.delete("/note/:noteId", noteController.delete);
router.get("/search", noteController.search);

module.exports = router;

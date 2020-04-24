const express = require("express");
const tasksController = require("./controller");
const router = express.Router();

router.get(
  "/unsigned_images_count/:bucket_name/:bucket_path",
  tasksController.getUnsignedImagesCount
);
router.post("/complete", tasksController.completeTask);
router.get("/:taskId", tasksController.getTask);
router.post("/", tasksController.createTask);

module.exports = router;

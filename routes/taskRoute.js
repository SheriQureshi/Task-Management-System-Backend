const express = require("express");
const router = express.Router();

const { createTask, getAllTasks , updateTask, deleteTask, getUserTasks, getTasksByPriorityAndStatus, updateTaskStatus, updateTaskPriority, updateTaskDiscription} = require("../controllers/taskController");
const {verifyToken} = require('../middleware/verifyToken')
router.post("/create-task",verifyToken, createTask);
router.post("/alltask", getAllTasks);
router.post("/user-task", getUserTasks);
router.get("/user-task-by-priority-status", getTasksByPriorityAndStatus);
router.put("/update-task",verifyToken, updateTask);
router.delete("/delete-task", deleteTask);
router.put("/update-task-status", updateTaskStatus);
router.put("/update-task-priority", updateTaskPriority);
router.put("/update-task-description", updateTaskDiscription);

module.exports = router;

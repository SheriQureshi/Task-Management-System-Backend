const models = require("../models");
const User = require("../models/User");

const getAllTasks = async (req, res) => {
  try {
    //   Check if the user is an admin before fetching all tasks
    const {
      title,
      discription,
      priority,
      status,
      dueDate,
      assigneeId,
      role,
      userId,
    } = req.body;
    const user = await models.User.findByPk(req.body.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Fetch all tasks with additional details
    const tasks = await models.Task.findAll({
      include: [
        {
          model: models.User,
          as: "assignee",
          attributes: ["id", "username"],
        },
        /*   {
            model: models.User,
            attributes: ['id', 'username'],
          }, */
      ],
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createTask = async (req, res) => {
  try {
    // Check if the user is a manager before creating a task
    const user = await models.User.findByPk(req.body.userId);
    // console.log("user id", req.body.userId);
    if (!user || (user.role !== "manager" && user.role !== "admin")) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Implement task creation logic here
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assigneeId,
      role,
      userId,
    } = req.body;
    console.log("data", req.body);
    const task = await models.Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      role,
      assigneeId,
      userId,
      // Record the manager who created the task
    });
    const allUsers = await models.User.findAll({
      where: {
        role: "user",
      },
    });

    res.json({
      message: "task created successfully",
      task: task,
      users: allUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateTask = async (req, res) => {
  try {
    // Check if the user is a manager before updating a task
    const user = await models.User.findByPk(req.body.userId);
    if (!user || user.role !== "manager") {
      return res.status(403).json({ message: "Permission denied" });
    }

    //   const taskId = req.params.id;
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assigneeId,
      role,
      userId,
    } = req.body;

    // Check if the task exists
    const task = await models.Task.findByPk(req.body.userId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the manager created the task
    if (task.userId !== req.userId) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Update task details
    task.title = title;
    task.description = description;
    task.priority = priority;
    task.status = status;
    task.dueDate = dueDate;
    task.assigneeId = assigneeId;

    // Save the updated task
    await task.save();

    //   res.status(200).json("task updated");
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    // Check if the user is a manager before deleting a task
    const user = await models.User.findByPk(req.body.userId);
    if (!user || (user.role !== "manager" && user.role !== "admin")) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Check if the task exists
    const task = await models.Task.findByPk(req.body.id);
    console.log();
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the manager created the task
    if (task.userId !== req.userId) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Delete the task
    await task.destroy();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming you have middleware to extract user ID from the request

    // Get user information
    const user = await models.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get tasks for the user
    const userTasks = await models.Task.findAll({
      where: {
        assigneeId: userId,
      },
      include: [
        {
          model: models.User,
          as: "assignee",
          attributes: ["id", "username"],
        },
      ],
    });

    res.json(userTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTasksByPriorityAndStatus = async (req, res) => {
  try {
    const { priority, status, userId } = req.body;

    // Get user information
    const user = await models.User.findOne({
      where: {
        id: userId,
      },
      attributes: ["id", "username"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get tasks for the user
    const tasks = await models.Task.findAll({
      where: {
        priority: priority,
        status: status,
        assigneeId: userId,
      },
    });

    // Combine user information and tasks in the response
    const response = {
      user: {
        id: user.id,
        username: user.username,
      },
      tasks: tasks,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const updateTaskStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    // Assuming you have a Sequelize Task model defined
    const [updatedRowsCount, updatedTasks] = await models.Task.update(
      { status }, // new status value
      { where: { id }, returning: true } // returning: true to get the updated rows
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, updatedTask: updatedTasks[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const updateTaskPriority = async (req, res) => {
  try {
    const { id, priority } = req.body;

    // Assuming you have a Sequelize Task model defined
    const [updatedRowsCount, updatedTasks] = await models.Task.update(
      { priority }, // new status value
      { where: { id }, returning: true } // returning: true to get the updated rows
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, updatedTask: updatedTasks[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateTaskDiscription = async (req, res) => {
  try {
    const { id, description } = req.body;

    // Find the task by ID
    const task = await models.Task.findByPk(id);

    if (task) {
      // Update the task description
      await task.update({ description });

      res.json({ success: true, message: 'Task description updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task description:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getUserTasks,
  getTasksByPriorityAndStatus,
  updateTaskStatus,
  updateTaskPriority,
  updateTaskDiscription
};

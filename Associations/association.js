// associations.js
const User = require('../models/User');
const Task = require('../models/Task');

User.hasMany(Task, { foreignKey: 'assigneeId' });
Task.belongsTo(User, { as: 'assignee' });

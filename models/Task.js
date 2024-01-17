module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    priority: {
      type: DataTypes.ENUM("low", "normal", "high"),
      allowNull: false,
    },
    status: { 
      type: DataTypes.ENUM("pending", "progress", "complete"),
      allowNull: false,
      defaultValue: "pending",
    },
    dueDate: {
      type: DataTypes.DATE,
    },
    assigneeId: {
      type: DataTypes.UUID, // Assuming your User model uses INTEGER as the data type for the primary key
      allowNull: false,
    },
  });
  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      as: "assignee",
      foreignKey: "assigneeId",
    });

   
  };

  return Task;
};

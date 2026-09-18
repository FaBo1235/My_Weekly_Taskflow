const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    time: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    priority: {
      type: DataTypes.ENUM(
        'low',
        'normal',
        'high',
        'urgent'
      ),
      defaultValue: 'normal',
      allowNull: false,
    },

    category: {
      type: DataTypes.ENUM(
        'personal',
        'work',
        'study',
        'other'
      ),
      defaultValue: 'other',
      allowNull: false,
    },

    reminder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },

    status: {
      type: DataTypes.ENUM(
        'todo',
        'in-progress',
        'done'
      ),
      defaultValue: 'todo',
      allowNull: false,
    },

    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: 'tasks',
    timestamps: true,
  }
)

module.exports = Task
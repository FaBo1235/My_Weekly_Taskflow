const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const RecurringTask = sequelize.define(
  'RecurringTask',
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

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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

    recurrence: {
      type: DataTypes.ENUM(
        'daily',
        'weekly',
        'biweekly',
        'monthly'
      ),
      allowNull: false,
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: 'recurring_tasks',
    timestamps: true,
  }
)

module.exports = RecurringTask
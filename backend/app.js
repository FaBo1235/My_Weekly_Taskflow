const express = require('express')
const cors = require('cors')
require('dotenv').config()

const sequelize = require('./config/database')

const Task = require('./models/Task')
const User = require('./models/User')
const RecurringTask = require('./models/RecurringTask')

const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')

const app = express()

const PORT = process.env.PORT || 5001

// Relations User -> Tasks
User.hasMany(Task, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
})

Task.belongsTo(User, {
  foreignKey: 'userId',
})

// Relations User -> RecurringTasks
User.hasMany(RecurringTask, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
})

RecurringTask.belongsTo(User, {
  foreignKey: 'userId',
})

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/tasks', taskRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'TaskFlow API fonctionne !',
  })
})

// Test de connexion à MySQL
sequelize
  .authenticate()
  .then(() => {
    console.log('Connexion à MySQL réussie !')

    return sequelize.sync()
  })
  .then(() => {
    console.log('Tables synchronisées !')

    app.listen(PORT, () => {
      console.log(
        `TaskFlow API démarrée sur http://localhost:${PORT}`
      )
    })
  })
  .catch((error) => {
    console.error(
      'Erreur de connexion à MySQL :',
      error
    )
  })
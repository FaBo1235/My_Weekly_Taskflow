const Task = require('../models/Task')

// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
        
        where : { userId: req.user.userId }, // Assurez-vous que l'utilisateur est authentifié et que req.user est défini
        order: [
            ['date', 'ASC'],
            ['time', 'ASC'],
        ],
    })

    res.json(tasks)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Erreur lors de la récupération des tâches',
    })
  }
}

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
        where: {
            id: req.params.id,
            userId: req.user.userId, // Assurez-vous que l'utilisateur est authentifié et que req.user est défini
        },
        })

    if (!task) {
      return res.status(404).json({
        message: 'Tâche introuvable',
      })
    }

    res.json(task)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Erreur lors de la récupération de la tâche',
    })
  }
}

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      priority,
      category,
      reminder,
      status,
      completed,
    } = req.body

    if (!title || !date) {
      return res.status(400).json({
        message: 'Le titre et la date sont obligatoires',
      })
    }

    const task = await Task.create({
    userId: req.user.userId, // Assurez-vous que l'utilisateur est authentifié et que req.user est défini
      title,
      description,
      date,
      time,
      priority,
      category,
      reminder,
      status,
      completed,
    })

    res.status(201).json(task)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Erreur lors de la création de la tâche',
    })
  }
}

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
        where: {
            id: req.params.id,
            userId: req.user.userId, // Assurez-vous que l'utilisateur est authentifié et que req.user est défini
        },
    })

    if (!task) {
      return res.status(404).json({
        message: 'Tâche introuvable',
      })
    }

    await task.update({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        time: req.body.time,
        priority: req.body.priority,
        category: req.body.category,
        reminder: req.body.reminder,
        status: req.body.status,
        completed: req.body.completed,
    })

    res.json(task)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Erreur lors de la modification de la tâche',
    })
  }
}

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
        where: {
            id: req.params.id,
            userId: req.user.userId, // Assurez-vous que l'utilisateur est authentifié et que req.user est défini
        },
    })
    if (!task) {
      return res.status(404).json({
        message: 'Tâche introuvable',
      })
    }

    await task.destroy()

    res.json({
      message: 'Tâche supprimée avec succès',
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Erreur lors de la suppression de la tâche',
    })
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}
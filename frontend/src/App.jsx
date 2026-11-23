
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import Navbar from './components/Navbar'
import TaskModal from './components/TaskModal'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

const API_URL = 'http://localhost:5001/api/tasks'

function AppContent() {
  const location = useLocation()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [taskToEdit, setTaskToEdit] = useState(null)

  // Trouver le lundi de la semaine actuelle
  const getMonday = (date) => {
    const result = new Date(date)
    const day = result.getDay()
    const difference = day === 0 ? -6 : 1 - day

    result.setDate(result.getDate() + difference)
    result.setHours(0, 0, 0, 0)

    return result
  }

  const monday = getMonday(currentDate)

  // Générer les 7 jours de la semaine
  const weekDays = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + index)
      return date
    }
  )

  // Charger les tâches depuis l'API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          setTasks([])
          return
        }

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des tâches')
        }

        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error('Erreur API :', error)
      }
    }

    fetchTasks()
  }, [location])

  // Semaine précédente
  const previousWeek = () => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - 7)
    setCurrentDate(date)
  }

  // Semaine suivante
  const nextWeek = () => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() + 7)
    setCurrentDate(date)
  }

  // Retour à la semaine actuelle
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Formatage d'une date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
    }).format(date)
  }

  // Titre de la semaine
  const formatWeekTitle = () => {
    const start = weekDays[0]
    const end = weekDays[6]

    const startMonth = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
    }).format(start)

    const endMonth = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
    }).format(end)

    if (startMonth === endMonth) {
      return `Semaine du ${start.getDate()} au ${end.getDate()} ${endMonth}`
    }

    return `Semaine du ${formatDate(start)} au ${formatDate(end)}`
  }

  // Noms des jours
  const dayNames = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ]

  // Convertir une date en YYYY-MM-DD
  const formatInputDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // Vérifier si une journée correspond à aujourd'hui
  const isToday = (date) => {
    return formatInputDate(date) === formatInputDate(new Date())
  }

  // Vérifier si une tâche est en retard
  const isTaskOverdue = (task) => {
    if (task.status === 'done' || task.completed) {
      return false
    }

    if (!task.date) {
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const taskDate = new Date(`${task.date}T00:00:00`)
    taskDate.setHours(0, 0, 0, 0)

    return taskDate < today
  }

  // Déterminer la couleur de la tâche
  const getTaskColors = (task) => {
    if (task.status === 'done' || task.completed) {
      return {
        container: 'border-green-200 bg-green-50',
        title: 'text-green-900',
        secondary: 'text-green-700',
        badge: 'bg-green-100 text-green-700',
        label: 'Terminé',
      }
    }

    if (isTaskOverdue(task)) {
      return {
        container: 'border-red-200 bg-red-50',
        title: 'text-red-900',
        secondary: 'text-red-700',
        badge: 'bg-red-100 text-red-700',
        label: 'En retard',
      }
    }

    if (task.priority === 'high' || task.priority === 'urgent') {
      return {
        container: 'border-orange-200 bg-orange-50',
        title: 'text-orange-900',
        secondary: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-700',
        label: 'Prioritaire',
      }
    }

    if (task.status === 'in-progress') {
      return {
        container: 'border-violet-200 bg-violet-50',
        title: 'text-violet-900',
        secondary: 'text-violet-700',
        badge: 'bg-violet-100 text-violet-700',
        label: 'En cours',
      }
    }

    return {
      container: 'border-blue-200 bg-blue-50',
      title: 'text-blue-900',
      secondary: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-700',
      label: 'À faire',
    }
  }

  // Ouvrir la fenêtre pour créer une tâche
  const openTaskModal = (date) => {
    const formattedDate = formatInputDate(date)

    setTaskToEdit(null)
    setSelectedDate(formattedDate)
    setIsModalOpen(true)
  }

  // Ouvrir la fenêtre pour modifier une tâche
  const openEditModal = (task) => {
    setTaskToEdit(task)
    setSelectedDate(task.date)
    setIsModalOpen(true)
  }

  // Fermer la fenêtre
  const closeTaskModal = () => {
    setIsModalOpen(false)
    setSelectedDate(null)
    setTaskToEdit(null)
  }

  // Créer ou modifier une tâche et enregistrer ses sous-tâches
  const saveTask = async (task, subtasksToSave = []) => {
    const savedTasks = []

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Vous devez être connecté.')
      }

      const existingTask = tasks.some(
        (currentTask) => Number(currentTask.id) === Number(task.id)
      )

      // Modifier une tâche existante
      if (existingTask) {
        const response = await fetch(`${API_URL}/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(task),
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la modification de la tâche')
        }

        const updatedTask = await response.json()

        setTasks((currentTasks) =>
          currentTasks.map((currentTask) =>
            Number(currentTask.id) === Number(updatedTask.id)
              ? updatedTask
              : currentTask
          )
        )

        closeTaskModal()
        return
      }

      // Fonction de création d'une tâche
      const createTask = async (taskData) => {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          throw new Error(
            errorData.message || 'Erreur lors de la création de la tâche'
          )
        }

        const createdTask = await response.json()
        savedTasks.push(createdTask)

        return createdTask
      }

      // 1. Créer la tâche principale
      const parentTask = await createTask(task)

      // 2. Créer les sous-tâches
      for (const subtaskTitle of subtasksToSave) {
        await createTask({
          title: subtaskTitle,
          date: task.date,
          description: null,
          time: null,
          priority: task.priority,
          category: task.category,
          reminder: null,
          status: 'todo',
          completed: false,
          parentTaskId: parentTask.id,
        })
      }

      // 3. Actualiser le calendrier
      setTasks((currentTasks) => [
        ...currentTasks,
        ...savedTasks,
      ])

      closeTaskModal()
    } catch (error) {
      if (savedTasks.length > 0) {
        setTasks((currentTasks) => [
          ...currentTasks,
          ...savedTasks,
        ])
      }

      console.error('Erreur API :', error)
      alert(error.message)
    }
  }

  // Modifier directement le statut
  const changeTaskStatus = async (taskId, newStatus) => {
    const task = tasks.find(
      (currentTask) => Number(currentTask.id) === Number(taskId)
    )

    if (!task) return

    const updatedTask = {
      ...task,
      status: newStatus,
      completed: false,
    }

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du statut')
      }

      const savedTask = await response.json()

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          Number(currentTask.id) === Number(taskId)
            ? savedTask
            : currentTask
        )
      )
    } catch (error) {
      console.error('Erreur API :', error)
    }
  }

  // Marquer une tâche ou une sous-tâche comme terminée
  const toggleTaskCompleted = async (taskId) => {
    const task = tasks.find(
      (currentTask) => Number(currentTask.id) === Number(taskId)
    )

    if (!task) return

    const isCompleted =
      task.status === 'done' || task.completed

    const updatedTask = {
      ...task,
      completed: !isCompleted,
      status: !isCompleted ? 'done' : 'todo',
    }

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de la tâche')
      }

      const savedTask = await response.json()

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          Number(currentTask.id) === Number(taskId)
            ? savedTask
            : currentTask
        )
      )
    } catch (error) {
      console.error('Erreur API :', error)
    }
  }

  // Supprimer une tâche
  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la tâche')
      }

      // Retirer aussi les sous-tâches de l'affichage
      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) =>
            Number(task.id) !== Number(taskId) &&
            Number(task.parentTaskId) !== Number(taskId)
        )
      )
    } catch (error) {
      console.error('Erreur API :', error)
      alert(error.message)
    }
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-slate-50">
              <Navbar />

              <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

                {/* En-tête */}
                <div className="mb-8">
                  <p className="text-sm font-medium text-blue-800">
                    {formatWeekTitle()}
                  </p>

                  <h1 className="mt-2 text-3xl font-bold text-blue-950">
                    Ma semaine
                  </h1>

                  <p className="mt-2 text-slate-500">
                    Organisez vos tâches et gardez le contrôle de votre semaine.
                  </p>
                </div>

                {/* Navigation de la semaine */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={previousWeek}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      onClick={nextWeek}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                    >
                      →
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={goToToday}
                      className="rounded-lg bg-blue-950 px-4 py-2 font-medium text-white hover:bg-blue-900"
                    >
                      Aujourd'hui
                    </button>
                  </div>
                </div>

                {/* Jours de la semaine */}
                <div className="flex flex-wrap gap-4">
                  {weekDays.map((date, index) => {
                    const localDate = formatInputDate(date)
                    const today = isToday(date)

                    // Afficher uniquement les tâches principales
                    const dayTasks = tasks.filter(
                      (task) =>
                        task.date === localDate &&
                        (task.parentTaskId === null ||
                          task.parentTaskId === undefined)
                    )

                    return (
                      <div
                        key={localDate}
                        className={`
                          min-h-55 w-full rounded-xl border p-4 shadow-sm transition
                          sm:w-[calc(50%-0.5rem)]
                          lg:w-[calc(25%-0.75rem)]
                          xl:w-[calc(14.2857%-0.86rem)]
                          ${
                            today
                              ? 'border-blue-400 bg-blue-50/50 shadow-md'
                              : 'border-slate-200 bg-white'
                          }
                        `}
                      >
                        {/* Jour */}
                        <div
                          className={`
                            mb-5 border-b pb-3
                            ${today ? 'border-blue-100' : 'border-slate-100'}
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <p
                              className={`
                                text-sm font-semibold uppercase tracking-wide
                                ${today ? 'text-blue-700' : 'text-blue-900'}
                              `}
                            >
                              {dayNames[index]}
                            </p>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            {today ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-sm">
                                {date.getDate()}
                              </div>
                            ) : (
                              <p className="text-2xl font-bold text-slate-800">
                                {date.getDate()}
                              </p>
                            )}
                          </div>

                          <p
                            className={`
                              text-sm capitalize
                              ${today ? 'text-blue-600' : 'text-slate-400'}
                            `}
                          >
                            {new Intl.DateTimeFormat('fr-FR', {
                              month: 'long',
                            }).format(date)}
                          </p>
                        </div>

                        {/* Liste des tâches */}
                        {dayTasks.length === 0 ? (
                          <p className="text-sm text-slate-400">
                            Aucune tâche
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {dayTasks.map((task) => {
                              const colors = getTaskColors(task)

                              // Récupérer les sous-tâches
                              const taskSubtasks = tasks.filter(
                                (subtask) =>
                                  subtask.parentTaskId !== null &&
                                  subtask.parentTaskId !== undefined &&
                                  Number(subtask.parentTaskId) === Number(task.id)
                              )

                              // Calculer la progression
                              const completedSubtasks = taskSubtasks.filter(
                                (subtask) =>
                                  subtask.status === 'done' ||
                                  subtask.completed
                              ).length

                              const progress =
                                taskSubtasks.length > 0
                                  ? (completedSubtasks / taskSubtasks.length) * 100
                                  : 0

                              return (
                                <div
                                  key={task.id}
                                  className={`rounded-lg border p-3 transition ${colors.container}`}
                                >
                                  {/* Titre et actions */}
                                  <div className="flex items-start gap-2 text-xs">
                                    <input
                                      type="checkbox"
                                      checked={
                                        task.status === 'done' ||
                                        task.completed
                                      }
                                      onChange={() =>
                                        toggleTaskCompleted(task.id)
                                      }
                                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-blue-900"
                                      aria-label="Marquer comme terminée"
                                    />

                                    <div className="min-w-0 flex-1">
                                      <p
                                        className={`font-semibold leading-5 ${
                                          task.status === 'done' ||
                                          task.completed
                                            ? 'text-slate-400 line-through'
                                            : colors.title
                                        }`}
                                      >
                                        {task.title}
                                      </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => openEditModal(task)}
                                        className="rounded-md text-sm text-slate-400 hover:bg-white/70 hover:text-blue-700"
                                        aria-label="Modifier la tâche"
                                        title="Modifier"
                                      >
                                        ✏️
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => deleteTask(task.id)}
                                        className="rounded-md py-1 text-sm text-slate-400 hover:bg-white/70 hover:text-red-600"
                                        aria-label="Supprimer la tâche"
                                        title="Supprimer"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>

                                  {/* Heure */}
                                  {task.time && (
                                    <p className={`mt-2 text-sm ${colors.secondary}`}>
                                      {task.time}
                                    </p>
                                  )}

                                  {/* Catégorie */}
                                  <p className={`mt-2 text-xs font-medium ${colors.secondary}`}>
                                    {task.category}
                                  </p>

                                  {/* Sous-tâches */}
                                  {taskSubtasks.length > 0 && (
                                    <div className="mt-4 border-t border-slate-200/70 pt-3">
                                      <div className="mb-3 flex items-center justify-between gap-2">
                                        <p className="text-xs font-semibold text-slate-700">
                                          Sous-tâches
                                        </p>

                                        <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-medium text-slate-600">
                                          {completedSubtasks}/{taskSubtasks.length}
                                        </span>
                                      </div>

                                      {/* Barre de progression */}
                                      <div
                                        className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-200"
                                        role="progressbar"
                                        aria-valuenow={completedSubtasks}
                                        aria-valuemin={0}
                                        aria-valuemax={taskSubtasks.length}
                                        aria-label="Progression des sous-tâches"
                                      >
                                        <div
                                          className="h-full rounded-full bg-green-500 transition-all"
                                          style={{ width: `${progress}%` }}
                                        />
                                      </div>

                                      {/* Liste des sous-tâches */}
                                      <div className="space-y-2">
                                        {taskSubtasks.map((subtask) => {
                                          const isCompleted =
                                            subtask.status === 'done' ||
                                            subtask.completed

                                          return (
                                            <div
                                              key={subtask.id}
                                              className="flex items-start gap-2"
                                            >
                                              <input
                                                type="checkbox"
                                                checked={isCompleted}
                                                onChange={() =>
                                                  toggleTaskCompleted(subtask.id)
                                                }
                                                className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-green-600"
                                                aria-label={`Terminer ${subtask.title}`}
                                              />

                                              <span
                                                className={`min-w-0 text-xs leading-5 ${
                                                  isCompleted
                                                    ? 'text-slate-400 line-through'
                                                    : 'text-slate-700'
                                                }`}
                                              >
                                                {subtask.title}
                                              </span>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* Statut */}
                                  <div className="mt-3">
                                    {task.status === 'done' ||
                                    task.completed ? (
                                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                                        🟢 Terminé
                                      </span>
                                    ) : (
                                      <select
                                        value={task.status}
                                        onChange={(event) =>
                                          changeTaskStatus(
                                            task.id,
                                            event.target.value
                                          )
                                        }
                                        className={`w-full cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none ${colors.badge}`}
                                        aria-label="Modifier le statut"
                                      >
                                        <option value="todo">
                                          🔵 À faire
                                        </option>

                                        <option value="in-progress">
                                          🟣 En cours
                                        </option>
                                      </select>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Ajouter une tâche */}
                        <button
                          type="button"
                          onClick={() => openTaskModal(date)}
                          className={`
                            mt-6 w-full rounded-lg border border-dashed
                            px-3 py-2 text-sm font-medium transition
                            ${
                              today
                                ? 'border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-100'
                                : 'border-slate-300 text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800'
                            }
                          `}
                        >
                          + Ajouter
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Fenêtre d'ajout / modification */}
                <TaskModal
                  isOpen={isModalOpen}
                  onClose={closeTaskModal}
                  selectedDate={selectedDate}
                  onSave={saveTask}
                  taskToEdit={taskToEdit}
                />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

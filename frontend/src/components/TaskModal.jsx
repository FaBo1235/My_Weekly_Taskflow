
import { useState } from 'react'

function TaskModal(props) {
  if (!props.isOpen) {
    return null
  }

  return (
    <TaskForm
      key={`${props.taskToEdit?.id || 'new'}-${props.selectedDate || ''}`}
      {...props}
    />
  )
}

function TaskForm({
  onClose,
  selectedDate,
  onSave,
  taskToEdit,
}) {
  // Informations de la tâche
  const [title, setTitle] = useState(taskToEdit?.title || '')

  const [description, setDescription] = useState(
    taskToEdit?.description || ''
  )

  const [date, setDate] = useState(
    taskToEdit?.date || selectedDate || ''
  )

  const [time, setTime] = useState(taskToEdit?.time || '')

  const [priority, setPriority] = useState(
    taskToEdit?.priority || 'normal'
  )

  const [category, setCategory] = useState(
    taskToEdit?.category || 'personal'
  )

  const [reminder, setReminder] = useState(
    taskToEdit?.reminder !== null &&
    taskToEdit?.reminder !== undefined
      ? String(taskToEdit.reminder)
      : 'none'
  )

  // Gestion de l'IA et des sous-tâches
  const [subtasks, setSubtasks] = useState([])
  const [selectedSubtasks, setSelectedSubtasks] = useState([])
  const [newSubtask, setNewSubtask] = useState('')

  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  const isEditing = Boolean(taskToEdit)

  // Demander à Gemini de découper la tâche
  const handleBreakdown = async () => {
    if (!title.trim()) {
      setAiError(
        'Le titre de la tâche est obligatoire pour générer des sous-tâches.'
      )
      return
    }

    setAiLoading(true)
    setAiError('')
    setSubtasks([])
    setSelectedSubtasks([])

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Vous devez être connecté pour utiliser l’assistant IA.')
      }

      const response = await fetch(
        'http://localhost:5001/api/ai/breakdown',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Impossible de contacter Gemini.'
        )
      }

      if (
        !Array.isArray(data.subtasks) ||
        data.subtasks.length === 0
      ) {
        throw new Error(
          'Gemini n’a pas retourné de sous-tâches. Réessaie.'
        )
      }

      setSubtasks(data.subtasks)
      setSelectedSubtasks(
        data.subtasks.map((subtask) => subtask.title)
      )

    } catch (error) {
      console.error('Erreur assistant IA :', error)
      setAiError(error.message)

    } finally {
      setAiLoading(false)
    }
  }

  // Ajouter une sous-tâche manuellement
  const handleAddSubtask = () => {
    const trimmedTitle = newSubtask.trim()

    if (!trimmedTitle) return

    // Éviter les doublons
    const alreadyExists = subtasks.some(
      (subtask) =>
        subtask.title.toLowerCase() === trimmedTitle.toLowerCase()
    )

    if (alreadyExists) {
      setAiError('Cette sous-tâche existe déjà.')
      return
    }

    setSubtasks((previous) => [
      ...previous,
      { title: trimmedTitle },
    ])

    setSelectedSubtasks((previous) => [
      ...previous,
      trimmedTitle,
    ])

    setNewSubtask('')
    setAiError('')
  }

  // Enregistrer la tâche et les sous-tâches sélectionnées
  const handleSubmit = (event) => {
    event.preventDefault()

    if (!title.trim() || !date) {
      return
    }

    const task = {
      id: taskToEdit?.id,
      title: title.trim(),
      date,
      description: description.trim() || null,
      time: time || null,
      priority,
      category,
      reminder: reminder === 'none' ? null : Number(reminder),
      status: taskToEdit?.status || 'todo',
      completed: taskToEdit?.completed || false,
    }

    onSave(task, isEditing ? [] : selectedSubtasks)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 px-4">

      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-blue-950">
              {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {date}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>

        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-5"
        >

          {/* Titre */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Titre *
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setAiError('')
              }}
              placeholder="Ex : Organiser un projet"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Ajouter une description..."
              rows="2"
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Assistant IA */}
          {!isEditing && (
            <div className="space-y-3 rounded-xl border border-violet-200 bg-violet-50/50 p-4">

              <div>
                <h3 className="font-semibold text-blue-950">
                  Assistant IA
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Laisses Gemini transformer ta tâche en étapes concrètes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleBreakdown}
                disabled={aiLoading || !title.trim()}
                className="w-full rounded-lg bg-violet-700 px-4 py-2.5 font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {aiLoading
                  ? 'Gemini prépare les sous-tâches...'
                  : 'Générer les sous-tâches avec l’IA'}
              </button>

              {aiLoading && (
                <p className="text-sm text-violet-800">
                  Analyse de ta tâche en cours...
                </p>
              )}

              {aiError && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {aiError}
                </p>
              )}

            </div>
          )}

          {/* Gestion des sous-tâches */}
          {!isEditing && (
            <div className="space-y-3">

              <h3 className="font-semibold text-blue-950">
                Sous-tâches
              </h3>

              <div className="flex gap-2">

                <input
                  type="text"
                  value={newSubtask}
                  onChange={(event) =>
                    setNewSubtask(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddSubtask()
                    }
                  }}
                  placeholder="Ajouter une sous-tâche..."
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="rounded-lg bg-violet-100 px-4 py-2 font-medium text-violet-800 hover:bg-violet-200"
                >
                  Ajouter
                </button>

              </div>

              {subtasks.length > 0 ? (
                <div className="space-y-3 rounded-xl border border-violet-200 bg-violet-50/50 p-4">

                  <h4 className="font-medium text-blue-950">
                    Liste des sous-tâches
                  </h4>

                  {subtasks.map((subtask, index) => (
                    <label
                      key={`${subtask.title}-${index}`}
                      className="flex cursor-pointer items-start gap-3 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubtasks.includes(subtask.title)}
                        onChange={(event) => {
                          setSelectedSubtasks((previous) =>
                            event.target.checked
                              ? [...previous, subtask.title]
                              : previous.filter(
                                  (item) => item !== subtask.title
                                )
                          )
                        }}
                        className="mt-1 accent-violet-700"
                      />

                      <span>{subtask.title}</span>
                    </label>
                  ))}

                  <p className="text-xs text-slate-500">
                    Coche les sous-tâches que tu souhaites enregistrer.
                  </p>

                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Aucune sous-tâche pour le moment.
                </p>
              )}

            </div>
          )}

          {/* Date et heure */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date *
              </label>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Heure
              </label>

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* Priorité */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Priorité
            </label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            >
              <option value="low">Faible</option>
              <option value="normal">Normale</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          {/* Catégorie */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Catégorie
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            >
              <option value="personal">Personnel</option>
              <option value="work">Travail</option>
              <option value="study">Études</option>
              <option value="other">Autre</option>
            </select>
          </div>

          {/* Rappel */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Rappel
            </label>

            <select
              value={reminder}
              onChange={(event) =>
                setReminder(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            >
              <option value="none">Aucun rappel</option>
              <option value="5">5 minutes avant</option>
              <option value="15">15 minutes avant</option>
              <option value="30">30 minutes avant</option>
              <option value="60">1 heure avant</option>
              <option value="1440">1 jour avant</option>
              <option value="2880">2 jours avant</option>
              <option value="10080">1 semaine avant</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-950 px-5 py-2 font-medium text-white hover:bg-blue-900"
            >
              {isEditing
                ? 'Enregistrer les modifications'
                : 'Créer la tâche'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default TaskModal

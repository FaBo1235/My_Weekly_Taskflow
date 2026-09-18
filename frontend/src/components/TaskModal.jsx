import { useEffect, useState } from 'react'

function TaskModal({
  isOpen,
  onClose,
  selectedDate,
  onSave,
  taskToEdit,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState('normal')
  const [category, setCategory] = useState('personal')
  const [reminder, setReminder] = useState('none')

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '')
      setDescription(taskToEdit.description || '')
      setDate(taskToEdit.date || '')
      setTime(taskToEdit.time || '')
      setPriority(taskToEdit.priority || 'normal')
      setCategory(taskToEdit.category || 'personal')

      setReminder(
        taskToEdit.reminder !== null &&
        taskToEdit.reminder !== undefined
          ? String(taskToEdit.reminder)
          : 'none'
      )
    } else {
      setTitle('')
      setDescription('')
      setDate(selectedDate || '')
      setTime('')
      setPriority('normal')
      setCategory('personal')
      setReminder('none')
    }
  }, [taskToEdit, selectedDate, isOpen])

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // Sécurité : le titre et la date sont obligatoires
    if (!title.trim() || !date) {
      return
    }

    const task = {
      id: taskToEdit ? taskToEdit.id : undefined,

      // Obligatoires
      title: title.trim(),
      date,

      // Facultatifs
      description: description.trim() || null,
      time: time || null,

      priority: priority || 'normal',
      category: category || 'personal',

      // Aucun rappel = null en base
      reminder:
        reminder === 'none'
          ? null
          : Number(reminder),

      status: taskToEdit?.status || 'todo',
      completed: taskToEdit?.completed || false,
    }

    onSave(task)
    onClose()
  }

  const isEditing = Boolean(taskToEdit)

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
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Ex : Envoyer le CV"
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

          {/* Date + heure */}
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
              <option value="none">
                Aucun rappel
              </option>

              <option value="5">
                5 minutes avant
              </option>

              <option value="15">
                15 minutes avant
              </option>

              <option value="30">
                30 minutes avant
              </option>

              <option value="60">
                1 heure avant
              </option>

              <option value="1440">
                1 jour avant
              </option>

              <option value="2880">
                2 jours avant
              </option>

              <option value="10080">
                1 semaine avant
              </option>
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
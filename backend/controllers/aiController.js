const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const breakdownTask = async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Le titre de la tâche est obligatoire',
      })
    }

    const prompt = `
Tu es un assistant de productivité.

Découpe la tâche suivante en exactement 3 sous-tâches
concrètes, simples et réalisables.

Tâche :
${title}

Description :
${description || 'Aucune description'}

Les sous-tâches doivent :
- être directement liées à la tâche principale ;
- commencer par une action ;
- être suffisamment précises pour être réalisées ;
- éviter les doublons ;
- rester courtes.
`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            subtasks: {
              type: 'array',
              minItems: 3,
              maxItems: 3,
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                  },
                },
                required: ['title'],
              },
            },
          },
          required: ['subtasks'],
        },
      },
    })

    const result = JSON.parse(response.text)

    res.json(result)
  } catch (error) {
    console.error('Erreur Gemini :', error)

    res.status(500).json({
      message: 'Impossible de découper la tâche avec l’IA',
    })
  }
}

module.exports = {
  breakdownTask,
}
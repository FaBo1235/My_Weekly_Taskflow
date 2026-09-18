const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Vérification des champs obligatoires
    if (!email || !password) {
      return res.status(400).json({
        message: 'Le nom, l’email et le mot de passe sont obligatoires',
      })
    }

    // Vérification de la longueur du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 8 caractères',
      })
    }

    // Vérification si l'email existe déjà
    const existingUser = await User.findOne({
      where: { email },
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Cette adresse email est déjà utilisée',
      })
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Création de l'utilisateur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // Ne jamais renvoyer le mot de passe
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Erreur lors de la création du compte',
    })
  }
}


// POST /api/auth/login
const login = async (req, res) => {
    try {
      const { email, password } = req.body
  
      // Vérification des champs
      if (!email || !password) {
        return res.status(400).json({
          message: 'L’email et le mot de passe sont obligatoires',
        })
      }
  
      // Recherche de l'utilisateur
      const user = await User.findOne({
        where: { email },
      })
  
      if (!user) {
        return res.status(401).json({
          message: 'Email ou mot de passe incorrect',
        })
      }
  
      // Vérification du mot de passe
      const passwordIsValid = await bcrypt.compare(
        password,
        user.password
      )
  
      if (!passwordIsValid) {
        return res.status(401).json({
          message: 'Email ou mot de passe incorrect',
        })
      }
  
      // Création du JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '24h',
        }
      )
  
      // Réponse
      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    } catch (error) {
      console.error(error)
  
      res.status(500).json({
        message: 'Erreur lors de la connexion',
      })
    }
  }

module.exports = {
  register,
  login,
}
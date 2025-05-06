const Feedback = require('../models/Feedback');
const { analyzeFeedback } = require('../services/openaiService');

// Importer les feedbacks depuis le fichier JSON
exports.importBulk = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Lire le contenu du fichier depuis le buffer
    let feedbacks;
    try {
      const fileContent = req.file.buffer.toString('utf-8');
      feedbacks = JSON.parse(fileContent);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(400).json({ error: 'Invalid JSON file' });
    }

    // Vérifier que c'est un tableau
    if (!Array.isArray(feedbacks)) {
      return res.status(400).json({ error: 'File content must be an array of feedbacks' });
    }

    // Vérifier la structure des feedbacks
    const isValidStructure = feedbacks.every(
      feedback => feedback.id && feedback.date && feedback.channel && feedback.text
    );

    if (!isValidStructure) {
      return res.status(400).json({
        error:
          'Invalid feedback structure. Each feedback must have id, date, channel, and text fields',
      });
    }

    // Supprimer d'abord tous les feedbacks existants de l'utilisateur
    await Feedback.deleteMany({ userId: req.user._id });

    // Ajouter l'ID de l'utilisateur à chaque feedback et analyser le texte
    const feedbacksWithUser = await Promise.all(
      feedbacks.map(async feedback => {
        const analysis = await analyzeFeedback(feedback.text);
        return {
          ...feedback,
          userId: req.user._id,
          sentiment: analysis.sentiment,
          theme: analysis.theme,
        };
      })
    );

    // Sauvegarder les feedbacks
    const result = await Feedback.insertMany(feedbacksWithUser);

    res.status(201).json({
      message: 'Feedbacks imported successfully',
      count: result.length,
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Récupérer le feedback d'un utilisateur
exports.getUserFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ userId: req.user._id });
    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un nouveau feedback
exports.createFeedback = async (req, res) => {
  try {
    const { content } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const feedback = new Feedback({
      userId: req.user._id,
      content,
      imageUrl,
    });

    await feedback.save();
    res.status(201).json({ feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les feedbacks de l'utilisateur connecté
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user._id }).sort({ date: -1 }); // Trier par date décroissante

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les feedbacks (admin seulement)
exports.getAllFeedbacksAdmin = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 }).populate('user', 'email role');

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    channel: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    sentiment: {
      type: Number,
      required: true,
      min: -1,
      max: 1,
    },
    theme: {
      type: String,
      required: true,
      enum: ['bug', 'feature', 'ui', 'performance', 'security', 'other'],
    },
  },
  {
    timestamps: true,
  }
);

// Supprimer tous les index existants et les recréer
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Cette fonction sera appelée après la connexion à MongoDB
async function resetIndexes() {
  try {
    // Supprimer tous les index sauf _id
    await Feedback.collection.dropIndexes();

    // Recréer les index non-uniques
    await Feedback.collection.createIndex({ id: 1 });
    await Feedback.collection.createIndex({ userId: 1 });

    console.log('Feedback indexes reset successfully');
  } catch (error) {
    console.error('Error resetting indexes:', error);
  }
}

// Exécuter la réinitialisation des index
resetIndexes();

module.exports = Feedback;

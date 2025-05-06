const Feedback = require('../models/Feedback');

// Répartition par canaux
exports.getChannelDistribution = async (req, res) => {
  try {
    const distribution = await Feedback.aggregate([
      {
        $group: {
          _id: '$channel',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          channel: '$_id',
          count: 1,
          percentage: {
            $multiply: [{ $divide: ['$count', { $sum: '$count' }] }, 100],
          },
        },
      },
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Répartition par thèmes
exports.getThemeDistribution = async (req, res) => {
  try {
    const distribution = await Feedback.aggregate([
      {
        $group: {
          _id: '$theme',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          theme: '$_id',
          count: 1,
          percentage: {
            $multiply: [{ $divide: ['$count', { $sum: '$count' }] }, 100],
          },
        },
      },
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Volume par jour
exports.getDailyVolume = async (req, res) => {
  try {
    const volume = await Feedback.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(volume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Moyenne de sentiment
exports.getSentimentAverage = async (req, res) => {
  try {
    const average = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageSentiment: { $avg: '$sentiment' },
        },
      },
    ]);

    res.json({
      averageSentiment: average[0]?.averageSentiment || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Distribution des sentiments (Positif/Neutre/Négatif)
exports.getSentimentDistribution = async (req, res) => {
  try {
    const distribution = await Feedback.aggregate([
      {
        $project: {
          sentiment_category: {
            $switch: {
              branches: [
                { case: { $gt: ['$sentiment', 0.2] }, then: 'positif' },
                { case: { $lt: ['$sentiment', -0.2] }, then: 'négatif' },
              ],
              default: 'neutre',
            },
          },
        },
      },
      {
        $group: {
          _id: '$sentiment_category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          percentage: {
            $multiply: [{ $divide: ['$count', { $sum: '$count' }] }, 100],
          },
        },
      },
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pourcentage de feedbacks critiques (sentiment < -0.5)
exports.getCriticalPercentage = async (req, res) => {
  try {
    const result = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          criticalCount: {
            $sum: {
              $cond: [{ $lt: ['$sentiment', -0.5] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          percentage: {
            $multiply: [{ $divide: ['$criticalCount', '$totalCount'] }, 100],
          },
          criticalCount: 1,
          totalCount: 1,
        },
      },
    ]);

    res.json({
      percentage: result[0]?.percentage || 0,
      criticalCount: result[0]?.criticalCount || 0,
      totalCount: result[0]?.totalCount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

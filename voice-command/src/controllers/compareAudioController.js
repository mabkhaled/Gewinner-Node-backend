const { extractFeatures, calculateSimilarity } = require('../utils/audioUtils');

exports.compare = async (req, res) => {
    const { file1, file2 } = req.body;

    if (file1 && file2) {
        try {
            const features1 = await extractFeatures(file1);
            const features2 = await extractFeatures(file2);

            const similarity = calculateSimilarity(features1, features2);

            res.json({ similarity });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred.' });
        }
    } else {
        res.status(400).json({ error: 'Please provide two audio files.' });
    }
};

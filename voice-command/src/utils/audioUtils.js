const dtw = require('dtw');
const Meyda = require('meyda');
const fs = require('fs');
const wavDecoder = require('wav-decoder');

async function extractFeatures(audioFile, nMfcc = 13) {
    try {
        const buffer = fs.readFileSync(audioFile);
        const decoded = await wavDecoder.decode(buffer);
        const signal = decoded.channelData[0];

        const mfcc = Meyda.extract('mfcc', signal, {
            sampleRate: decoded.sampleRate,
            numberOfMFCCCoefficients: nMfcc
        });

        return mfcc;
    } catch (error) {
        throw new Error('Error extracting features.');
    }
}

function calculateSimilarity(features1, features2) {
    if (features1.length < features2.length) {
        features1.push(...Array(features2.length - features1.length).fill(Array(features1[0].length).fill(0)));
    } else if (features1.length > features2.length) {
        features2.push(...Array(features1.length - features2.length).fill(Array(features2[0].length).fill(0)));
    }

    const dtwObj = new dtw(features1, features2);
    const dist = dtwObj.getDistance();

    const similarityThreshold = 100; // Adjust as needed
    return 1.0 - (dist / Math.max(dist, similarityThreshold));
}

module.exports = {
    extractFeatures,
    calculateSimilarity
};

// Imports the Google Cloud client libraries
//const vision = require("@google-cloud/vision");

import vision from "@google-cloud/vision";

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Bucket where the file resides, e.g. my-bucket';
// const fileName = 'Path to file within bucket, e.g. path/to/image.png';

// Performs text detection on the gcs file

async function getSingleScore(url) {
  const [result] = await client.textDetection(url);
  const detections = result.textAnnotations;

  if (detections && detections.length && detections[0].description) {
    let scoreOCR = detections[0].description.slice(0, 3);
    const isScore = scoreOCR.includes(",");
    if (isScore) {
      scoreOCR = parseFloat(scoreOCR.replace(",", "."));
      console.log(scoreOCR);
      return scoreOCR;
    }
  }
}

/*
const [result] = await client.textDetection(
  `https://www.indicereparabilite.fr/wp-content/uploads/2021/08/4-a-59-35-230x350.png`
);
const detections = result.textAnnotations;
console.log("Text:");
const score = parseFloat(
  detections[0].description.slice(0, 3).replace(",", ".")
);
console.log(score);
*/

/*
detections.forEach((text) => {
  console.log(text));
}
*/

/*
const score = await getSingleScore(
  "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/4-a-59-35-230x350.png"
);*/

const scores = [
  "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/0-a-19-3-230x350.png",
  "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/6-a-79-46-230x350.png",
  "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/4-a-59-35-230x350.png",
  "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/4-a-59-34-230x350.png",
  "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/6-a-79-45-230x350.png",
  "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/6-a-79-43-230x350.png",
  "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/4-a-59-33-230x350.png",
];

const scoreResults = [];

async function init() {
  /*
  scores.forEach(async (score) => {
    const result = await getSingleScore(score);
    scoreResults.push(result);
  });
  */

  /*
  for (const score of scores) {
    const result = await getSingleScore(score);
    scoreResults.push(result);
  }
  */

  /*

  const scoresAll = await Promise.all(
    scores.map(async (score) => {
      score = await getSingleScore(score);
      if (score) {
        scoreResults.push(score);
        return score;
      }
    })
  ).then((values) => {
    //console.log(values);
    console.log(scoreResults);
  });

  */

  const scoresAll = await scores.reduce(async (a, score) => {
    // Wait for the previous item to finish processing
    await a;
    // Process this item
    score = await getSingleScore(score);
    if (score) {
      scoreResults.push(score);
    } else {
      scoreResults.push(-1);
    }
  }, Promise.resolve());
  console.log("scoreResults");
  console.log(scoreResults);
}

init();

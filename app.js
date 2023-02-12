// Imports the Google Cloud client libraries
//const vision = require("@google-cloud/vision");

import vision from "@google-cloud/vision";
import fs from "fs";

// Creates a client
const client = new vision.ImageAnnotatorClient();

// const scores = [
//   "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/0-a-19-3-230x350.png",
//   "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/6-a-79-46-230x350.png",
//   "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/4-a-59-35-230x350.png",
//   "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/4-a-59-34-230x350.png",
//   "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/6-a-79-45-230x350.png",
//   "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/6-a-79-43-230x350.png",
//   "https://www.indicereparabilite.fr/wp-content/uploads/2021/08/4-a-59-33-230x350.png",
// ];

// const scores = require("./repairability-images.json");
//convert scores require to an es module import {  } from "module";
import scores from "./repairability-images.json" assert { type: "json" };

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Bucket where the file resides, e.g. my-bucket';
// const fileName = 'Path to file within bucket, e.g. path/to/image.png';

// Performs text detection on the gcs file

const writeLine = function (data) {
  fs.appendFile(
    "./repairability-scores.txt",
    data.join("\r\n"),
    "utf8",
    (err) => {
      if (err) {
        console.log(`Error writing to file: ${err}`);
      }
    }
  );
};

const writeAllData = function (data) {
  const dataJSON = JSON.stringify(data);

  fs.writeFile("./repairability-scores.json", dataJSON, "utf8", (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`File is written successfully!`);
    }
  });
};

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

const scoreResults = [];

async function init() {
  await scores.reduce(async (a, score) => {
    // Wait for the previous item to finish processing
    await a;
    // Process this item
    score = await getSingleScore(score);
    //write each score to a new line of a text file with node fs

    if (score) {
      scoreResults.push(score);
    } else {
      scoreResults.push(-1);
    }
  }, Promise.resolve());

  console.log("scoreResults");
  console.log(scoreResults);
  writeAllData(scoreResults);
}

init();

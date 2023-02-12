import vision from "@google-cloud/vision";
import fs from "fs";

// Creates a client
const client = new vision.ImageAnnotatorClient();

// const scores = require("./repairability-images.json");
//convert scores require to an es module import {  } from "module";
import scores from "./repairability-images.json" assert { type: "json" };

//will hold the array of all OCR-generated scores from the Cloud Vision API
const scoreResults = [];

//write a single record to a file
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

//write all repairability score data from an array to a file
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

//perform OCR on a single image to get its repairability score using the google cloud vision api
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

async function getAllScores() {
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

async function init() {
  getAllScores();
}

init();

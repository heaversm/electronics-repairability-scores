# Electronics Repairability Dataset

This is an open source dataset of the ease of repairability of various phones, tablets, televisions, and laptops taken from the [Indice de Repairabilité](https://www.indicereparabilite.fr/) compiled by [Spareka](https://www.spareka.fr/).

## The Dataset

The [repairability-final.csv](repairability-final.csv) file contains the final output data.

You can additionally access the data [in Google Sheets here](https://docs.google.com/spreadsheets/d/1ZMOe5CCLjBTWuiOnP9nE8g-6txdh79Atkwqhzc9sp7A/edit#gid=0), where it may be a bit easier to work with / preview.

I recorded a short walkthrough of the process of gathering this data 

## Goal

My goal in this project was to try and get data on how repairable electronics are from existing data sources, in order to use it in "green tech" applications. This information is surprisingly hard to come by in any comprehensive manner, and while iFixIt, a leader in the [Right to Repair Movement](https://repair.org) in the US, [compiles great data on their site](https://www.ifixit.com/laptop_repairability), I tried to utilize [iFixit's aging API](https://github.com/iFixit/dozuki-js), the best solution I was able to come up with was to get the data from the Indice de Repairabilité in France (where manufacturers are required to report on the repairability of the goods they produce according to a number of different metrics).

The data was collected via a no-code scraper called [Bardeen](https://www.bardeen.ai/) and, since the actual repairability scores were encoded into JPGs with no usable textual representation of the score (metadata, alt tags, data attributes, etc), I had to use the Google Cloud Vision API to convert the score in the image into text (which worked surprisingly well!)

[I've recorded a video of that process here](https://www.youtube.com/watch?v=BnJIcMfDQqc) in case it helps you compile data for your own puproses


## Running the Code

If you want to run a similar setup with the Cloud Vision API, here's how you set it up:

**Set up a GCP Project**

[Project Setup in GCloud](https://console.cloud.google.com/iam-admin/serviceaccounts/details/114076229133535764396/keys?project=repairability&supportedpurview=project)

**Enable Billing for the Project**
[Billing](https://console.cloud.google.com/billing/projects)

**Install the Cloud SDK on your machine**
[Install SDK](https://cloud.google.com/sdk/docs/install)

**Create a credentials file somewhere on your machine**
[Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc)
`gcloud auth application-default login`

**Export the location of those credentials to your path variable**
Export credentials path ([Instructions](https://stackoverflow.com/questions/35532645/google-cloud-vision-api-permission-denied)):

`export GOOGLE_APPLICATION_CREDENTIALS='/Users/[user]/Documents/[your_project]/[YOUR_JSON_FILE]'`

**Utilize Implicit Auth**

[Implicit Auth](https://cloud.google.com/docs/authentication/client-libraries)

(this can be revoked with)
`gcloud auth application-default revoke`

**Detection**

There is an overview of using the cloud vision API here:

[Detect Overview](https://cloud.google.com/vision/docs/detect-labels-image-client-libraries)

and specifically detecting text in images here:

[Detect Text in Images Tutorial](https://cloud.google.com/vision/docs/ocr?apix_params=%7B%22resource%22%3A%7B%22requests%22%3A%5B%7B%22features%22%3A%5B%7B%22type%22%3A%22TEXT_DETECTION%22%7D%5D%2C%22image%22%3A%7B%22source%22%3A%7B%22imageUri%22%3A%22https%3A%2F%2Fwww.indicereparabilite.fr%2Fwp-content%2Fuploads%2F2021%2F08%2F4-a-59-35-230x350.png%22%7D%7D%7D%5D%7D%7D)

**NodeJS Cloud Vision Library Source Code**
[Vision Source](https://github.com/googleapis/nodejs-vision)


**Example Usage**

```javascript
// Imports the Google Cloud client libraries
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Bucket where the file resides, e.g. my-bucket';
// const fileName = 'Path to file within bucket, e.g. path/to/image.png';

// Performs text detection on the gcs file
const [result] = await client.textDetection(`gs://${bucketName}/${fileName}`);
const detections = result.textAnnotations;
console.log('Text:');
detections.forEach(text => console.log(text));
```

## Contributing

I would love to hear about the following:

* A more comprehensive repairability dataset / data source
* A way of pulling existing iFixit or Indice de Repairabilité data without having to scrape
* A way of keeping that data up to date (bonus points if you want to fork this or pull-request with that solution
* Anywhere you've been able to make use of this data. Not looking for anything other than to know that it was useful!


## Additional Notes

**Display Image in Sheets:**
You can display an image URL directly in a Google Spreadsheet with this formula:

`=IMAGE(url)`

Additionally, I always have problems with asynchronous javascript, and these were helpful in constructing serial promises to keep all the detected text assigned to its proper image before proceeding.

* [Promises in Serial / Parallel](https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971)
* [Promise All](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)






[Project Setup in GCloud](https://console.cloud.google.com/iam-admin/serviceaccounts/details/114076229133535764396/keys?project=repairability&supportedpurview=project)

[Billing](https://console.cloud.google.com/billing/projects)

[Install SDK](https://cloud.google.com/sdk/docs/install)

[Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc)
`gcloud auth application-default login`

Export credentials path ([Instructions](https://stackoverflow.com/questions/35532645/google-cloud-vision-api-permission-denied)):

`export GOOGLE_APPLICATION_CREDENTIALS='/Users/mheavers/Documents/Mozilla/Environment/privacy-not-included/reparabilite/ocr/[YOUR_JSON_FILE]'`

[Implicit Auth](https://cloud.google.com/docs/authentication/client-libraries)

`gcloud auth application-default revoke`

Display Image in Sheets:
`=IMAGE(url)`

[Sheet](https://docs.google.com/spreadsheets/d/1ZMOe5CCLjBTWuiOnP9nE8g-6txdh79Atkwqhzc9sp7A/edit#gid=0)

[Detect Overview](https://cloud.google.com/vision/docs/detect-labels-image-client-libraries)

[Detect Text in Images Tutorial](https://cloud.google.com/vision/docs/ocr?apix_params=%7B%22resource%22%3A%7B%22requests%22%3A%5B%7B%22features%22%3A%5B%7B%22type%22%3A%22TEXT_DETECTION%22%7D%5D%2C%22image%22%3A%7B%22source%22%3A%7B%22imageUri%22%3A%22https%3A%2F%2Fwww.indicereparabilite.fr%2Fwp-content%2Fuploads%2F2021%2F08%2F4-a-59-35-230x350.png%22%7D%7D%7D%5D%7D%7D)

```
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

[Batch Detection](https://cloud.google.com/vision/docs/batch)

```
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const inputImageUri = 'gs://cloud-samples-data/vision/label/wakeupcat.jpg';
// const outputUri = 'gs://YOUR_BUCKET_ID/path/to/save/results/';

// Imports the Google Cloud client libraries
const {ImageAnnotatorClient} = require('@google-cloud/vision').v1;

// Instantiates a client
const client = new ImageAnnotatorClient();

// You can send multiple images to be annotated, this sample demonstrates how to do this with
// one image. If you want to use multiple images, you have to create a request object for each image that you want annotated.
async function asyncBatchAnnotateImages() {
  // Set the type of annotation you want to perform on the image
  // https://cloud.google.com/vision/docs/reference/rpc/google.cloud.vision.v1#google.cloud.vision.v1.Feature.Type
  const features = [{type: 'LABEL_DETECTION'}];

  // Build the image request object for that one image. Note: for additional images you have to create
  // additional image request objects and store them in a list to be used below.
  const imageRequest = {
    image: {
      source: {
        imageUri: inputImageUri,
      },
    },
    features: features,
  };

  // Set where to store the results for the images that will be annotated.
  const outputConfig = {
    gcsDestination: {
      uri: outputUri,
    },
    batchSize: 2, // The max number of responses to output in each JSON file
  };

  // Add each image request object to the batch request and add the output config.
  const request = {
    requests: [
      imageRequest, // add additional request objects here
    ],
    outputConfig,
  };

  // Make the asynchronous batch request.
  const [operation] = await client.asyncBatchAnnotateImages(request);

  // Wait for the operation to complete
  const [filesResponse] = await operation.promise();

  // The output is written to GCS with the provided output_uri as prefix
  const destinationUri = filesResponse.outputConfig.gcsDestination.uri;
  console.log(`Output written to GCS with prefix: ${destinationUri}`);
}

asyncBatchAnnotateImages();
```

[Vision Source](https://github.com/googleapis/nodejs-vision)

[Promises in Serial / Parallel](https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971)
[Promise All](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

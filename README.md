## Running

Make sure you are on the right Node.js version: `nvm use`.

## Configuration

You can change the configuration of this program without touching any JavaScript code - just update the values in `config.json`.

## Loading the Training and Testing Data

Data has been lightly processed from the `raw-data` directory to the `data` directory, where it is represented entirely in CSV format. You can load these files (or your own, as configured in `config.json`) into your MongoDB instance by running `npm load-data`. This MUST be done prior to starting the evolutionary algorithm.

## Data Used

Data used for training and testing is from the [BIOCADDIE 2016 DATASET RETRIEVAL CHALLENGE](https://biocaddie.org/biocaddie-2016-dataset-retrieval-challenge). This data is in its raw, unchanged form in the `raw-data` directory.
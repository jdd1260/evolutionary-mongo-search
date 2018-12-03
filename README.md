## Running

Make sure you are on the right Node.js version: `nvm use`.

## Configuration

You can change the configuration of this program without touching any JavaScript code - just update the values in `config.json`.

## Loading the Training and Testing Data

Data has been lightly processed from the `raw-data` directory to the `data` directory, where it is represented entirely in CSV format. You can load these files (or your own, as configured in `config.json`) into your MongoDB instance by running `npm load-data`. This MUST be done prior to starting the evolutionary algorithm.

## Data Used

Data used for training and testing is from the [BIOCADDIE 2016 DATASET RETRIEVAL CHALLENGE](https://biocaddie.org/biocaddie-2016-dataset-retrieval-challenge). This data is in its raw, unchanged form in the `raw-data` directory. You can download the document set there and store them in a directory called "documents". Since it is about 4.5 GB of documents, loading them into a MongoDB instance can be difficult. I wrote a script to do this for you. You can run it by running `npm load-docs` from the root directory.

Use of this data is not necessary. You can use any set of documents, queries, and annotations that you would like. I've tried to set this up so that all changes needed for running on your own data can be made in `config.json`, but you may need to make small changes to the code if your data does not match with the datasets I used.
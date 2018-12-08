# Evolutionary Mongo Search

This project is a tool to help improve the [text search feature](https://docs.mongodb.com/manual/text-search/) of MongoDB. 

It is very easy to set up a text search across multiple fields for a MongoDB collection. You can also customize the search by providing custom weights for the text fields you want to search on. However, it is unclear how to go about setting these weights wisely or evaluating your choices.

By making use of this project, a developer can generate better weights for their MongoDB text index. This tool is very customizable and only requires a collection of documents to search, a set of training queries, and a set of relevancy labels for those training queries. Testing queries and labels may be optionally used in order to evaluate the improvement of your result weights on data that is not your training data.

## How it Works

This uses an evolutionary algorithm to try improving on the best known weights. It starts with weights that the user can set (default weight for every field is 1). Each iteration of the algorithm then tries to "evolve" the current set of weights by randomly choosing half of the fields and then changing them randomly (some entirely random, some a small random addition/subtraction). It also tries a completely ranodom set of weights. It then evaluates all of the random evolutions (5 in total), and selects the best set of weights to return for that iteration. The next iteration starts with that best set of weights. It continues in this way until reaching the time limit that the user can configure. Once complete, it creates an index on the collection with those best weights and leaves it in place. This allows the developer to simply run this program and fine themselves with a ready-to-go text search index.

The goal is essentially to find a set of weights that performs well, then try a few tweaks to that to see if they perform better. In this way we iteratively improve, and the longer we can run the program the better our results will be. 

Note: the "best" weights are determined using average F-measure across all the training queries. The Beta value used for the F-Measure can be customized.

## How to Use - Basics

This project uses [NodeJS](https://nodejs.org/en/), [NVM](https://github.com/creationix/nvm), and [MongoDB](https://www.mongodb.com/). You will need to have each of them installed, although the MongoDB instance could be running on a remote server.

1. Fork the project and clone to your local machine. 
2. Make sure you are on the right Node.js version: `nvm use`. 
3. Configure your database connection (see below)
4. Define your text search schema and starting weights (see below).
5. Make sure your training and evaluation configuration is correct and matches your desires (see below).
6. Set a time you want it to run for in the `maxTimeInHours` field in `config.json`. This is not a strict limit, but the point at which it stops doing more iterations.
7. Run: `npm start`.
8. Weight for your `maxTimeInHours`. If testing is being used the program will output your final weights and what their F-Measure was on the testing data as compared to the starting weights.

## Configuration

You can change the configuration of this program without touching any JavaScript code - just update the values in `config.json`. There are many options there for you to adjust to your needs and desires. You can likely configure this tool to run with your data without making any changes outside the `config.json` file. 

### Configure Your Database

First, you will need to you will need to provide your MongoDB information. You can just provide a URL and any other needed options as defined [by the MongoDB Driver](http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#.connect). This is done in the `db` section of `config.json`.

Second, specify the collections used for your documents, training labels and queries, and (optionally) testing labels and queries. This is also done in the `db` section. The data in these collections will need to match some expectations:
1. The Documents collection must use at least 1 text field, as well as one field to serve as the unique ID (customizable at `config.data.documents.idField`) that is references in training and testing.
2. The training and testing query collections must match the form `{ id: '1', query: 'Sample Query' }`. Other fields are allowed, but these ones must be present.
3. The training and testing label collections must match the form `{ queryId: '1', DOCID: 123, relevance: 1 }`. The `queryId` field references the `id` field from step 2. The `DOCID` field refernces a document using its unique ID. The `relevance` field states how relevant the document with `DOCID` is for query with `queryId`. 0 is considered non-relevant. You can customize what is the minimum value to consider relevant in `config.evaluation.relevanceMin`.

#### Tool for Loading Data

I had to load my own data into my database, and I wrote tools to help convert from the TREC format that bioCADDIE used. You can replace the CSV files in the `data` directory with your own (just try to match the format) and then run `npm run load-data` to load these CSVs into collections. The file and collection names can all be changed using `config.json`.

### Configure Your Text Search

You can initialize the project with what you know (or assume) will be important for your text search. You can define the schema of the text index in `config.schema`. This just involves specifying which fields have text that you want to search on.

You can also set the weights that you would like to start the algorithm with. This could be the current weights that you use, a basic weighting of what you think is important, or 1 for every field (the default weighting).


### Configure Your Training, Evaluation, and Evolution

All parts of the training and evaluation can be customized in `config.json`, including:
- the number of documents to return for each query in `evaluation.querySize`
- the Beta value used for the F-Measure calculation in `evaluation.fMeasureBeta`. Read about this [here](https://en.wikipedia.org/wiki/Precision_and_recall#F-measure).
- the maximum values used for randomly generating weights in `training`
- the maximum time you would like the program to run for in `training.maxTimeInHours`. This is not a strict cutoff
- whether you want testing to be run at the beginning and end on a testing collection in `testing.shouldPerform`.

## Data Used For My Training and Testing

Data used for training and testing is from the [BIOCADDIE 2016 DATASET RETRIEVAL CHALLENGE](https://biocaddie.org/biocaddie-2016-dataset-retrieval-challenge). This data is in its raw, unchanged form in the `raw-data` directory. Data has been lightly processed from the `raw-data` directory to the `data` directory, where it is represented entirely in CSV format. You can download the document set from the bioCADDIE website and store them locally directory called "documents". Since it is about 4.5 GB of documents, loading them into a MongoDB instance can be difficult. I wrote a script to do this for you. You can run it by running `npm run load-docs` from the root directory. This will take a very long time to run.

## bioCADDIE Results

I tried multiple runs of this program on the 2016 bioCADDIE data set, varying the time, query size, and F-Measure each time. My result outputs can be found in the `results` directory. You can see that I always got the F-Measure to at least double after training. Here is a summary of the trials:

| Starting F-Measure | End F-Measure | Configuration                                 |
|--------------------|---------------|-----------------------------------------------|
| 0.015              | 0.054         | F1, 20 Search Results, 7 Hours of Training    |
| 0.061              | 0.129         | F0.5, 50 Search Results, 12 Hours of Training |
|                    |               |                                               |


# Parts Tracker ExpressJS Api

## Required services

This API makes use of MongoDb, Redis and Seq. These services will need to be configured before being able to run the Parts Tracker API.

## Example Environment Variables

Below is an example of what your `.env` file should look like. Copy these values to a new `.env` file and update them as needed:

```env
LOG_LEVEL=debug
MONGO_USER=root
MONGO_PASSWORD=1qazXSW@
MONGO_PATH=@localhost:27017
MONGO_DB=assessment_project
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=1qazXSW@
PORT=5000
SEQ_HOST=localhost
SEQ_PORT=5341
SEQ_API_KEY=
```

## Running application

Once the environment variables have been set (.env file or other) run the following to start the application

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:5000/api-docs](http://localhost:5000/api-docs) to view the Api documentation in the browser.

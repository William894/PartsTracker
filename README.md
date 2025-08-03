# Parts Tracker Application

## Getting Started

### 1. Docker

The quickest method to get the application running is to run the following command in the `docker-compose` folder.

```
docker compose up -d
```

When complete run the following to clean up the resources from docker

```
docker compose down --rmi local
```

#### Docker Compose Services

The following services are configured in `docker-compose/docker-compose.yml`:

| Container Name              | Description                       | Ports Exposed    | Depends On         | URL                              |
|-----------------------------|-----------------------------------|------------------|--------------------|-----------------------------------|
| PartsTracker.MongoDB        | MongoDB database                  | 27017            | -                  | -                                 |
| PartsTracker.MongoExpress   | MongoDB database web interface    | 5081             | -                  | [http://localhost:5081](http://localhost:5081) |
| PartsTracker.Redis          | Redis cache                       | 6379             | -                  | -                                 |
| PartsTracker.Seq            | Seq log server                    | 5341, 8081       | -                  | [http://localhost:8081](http://localhost:8081) |
| PartsTracker.Api            | Parts Tracker API server          | 5000             | mongo, redis, seq  | [http://localhost:5000/api-docs](http://localhost:5000/api-docs) |
| PartsTracker.Web            | Parts Tracker React App           | 5001             | api                | [http://localhost:5001](http://localhost:5001) |

---

### 2. Manual

- Setup the required MongoDb, Redis and Seq instances
- Update the .env files in the `client` and `server` folders
- Run `yarn start` in the `server` folder and then in the `client` folder

#### Example Environment Variables

Below is an example of what your `.env` file should look like for the API application. Copy these values to a new `.env` file in the `server` folder and update them as needed:

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

Below is an example of what your `.env` file should look like for the React application. Copy these values to a new `.env` file in the `client` folder and update them as needed:

```env
REACT_APP_API_URL=http://localhost:5000/api
PORT=5001
```
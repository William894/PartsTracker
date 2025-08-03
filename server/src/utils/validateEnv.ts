import { cleanEnv, num, str } from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_DB: str({default: 'assessment_project'}),
        REDIS_HOST: str(),
        REDIS_PORT: num(),
        PORT: num()
    });
}

export default validateEnv;
import App from "./app";
import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import 'reflect-metadata';

validateEnv();

const app = new App();

app.listen();
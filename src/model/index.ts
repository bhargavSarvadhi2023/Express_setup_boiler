import { Sequelize } from 'sequelize';
import { sequelize } from '../config/database';
import * as fs from 'fs';
import { logger } from '../logger/logger';
import * as path from 'path';

const basename = path.basename(module.filename);

export const db = {};

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.ts'
        );
    })
    .forEach((file) => {
        const modelPath = path.join(__dirname, file);
        const model = require(modelPath).default;
        if (!model) {
            logger.error(`Error loading model from file: ${modelPath}`);
            return;
        }
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;

sequelize.sync();

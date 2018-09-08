import bodyParser from 'body-parser';
import validator from 'express-validator';

export default app => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(validator());
};
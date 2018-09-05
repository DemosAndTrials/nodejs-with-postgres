import express from 'express';

import ApiRoutes from './controllers';

const app = express();

/**
 * API ROUTES
 */
app.use('/api', ApiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(`Server Running on port: ${PORT}`);
    }
});
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();


const app = express();

const PORT = process.env.PORT || 3001;

// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

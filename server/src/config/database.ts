import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
	process.env.DATABASE_URL ||
		'postgres://postgres:1313@localhost:5432/pick_flick',
	{
		logging: console.log, // Enable logging for debugging
		dialect: 'postgres',
		dialectOptions:
			process.env.NODE_ENV === 'production'
				? {
						ssl: {
							require: true,
							rejectUnauthorized: false,
						},
				  }
				: {},
	}
);

export const initDatabase = async () => {
	try {
		await sequelize.authenticate();
		console.log('Database connection has been established successfully.');

		await sequelize.sync({ alter: true });
		console.log('Database synced successfully.');
	} catch (error) {
		console.error(
			'Unable to connect to the database or sync models:',
			error
		);
		throw error;
	}
};

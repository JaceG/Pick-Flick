import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
	process.env.DATABASE_URL ||
		'postgres://postgres:1313@localhost:5432/pick_flick',
	{
		logging: console.log, // Enable logging for debugging (optional)
		dialect: 'postgres', // Specify the dialect
	}
);

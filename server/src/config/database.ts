import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const umzug = new Umzug({
	migrations: { glob: path.join(__dirname, '../migrations/*.js') },
	context: sequelize.getQueryInterface(),
	storage: new SequelizeStorage({ sequelize }),
	logger: console,
});

export const initDatabase = async () => {
	try {
		await sequelize.authenticate();
		console.log('Database connection has been established successfully.');

		// Run migrations
		const pendingMigrations = await umzug.pending();
		if (pendingMigrations.length > 0) {
			console.log(
				'Pending migrations:',
				pendingMigrations.map((m) => m.name)
			);
			await umzug.up();
			console.log('Migrations have been executed successfully.');
		} else {
			console.log('No pending migrations.');
		}

		// Don't sync models for now
		// await sequelize.sync({ alter: true });
		console.log('Database initialization completed.');
	} catch (error) {
		console.error(
			'Unable to connect to the database or run migrations:',
			error
		);
		throw error;
	}
};

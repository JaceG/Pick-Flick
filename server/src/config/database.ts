import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
	process.env.DATABASE_URL ||
		'postgres://postgres:1313@localhost:5432/pick_flick',
	{
		logging: console.log, // Enable logging for debugging (optional)
		dialect: 'postgres', // Specify the dialect
		dialectOptions:
			process.env.NODE_ENV === 'production'
				? {
						ssl: {
							require: true,
							rejectUnauthorized: false, // Disable for self-signed certificates
						},
				  }
				: {},
	}
);

// Test database connection
sequelize
	.authenticate()
	.then(() => {
		console.log('Database connection has been established successfully.');
	})
	.catch((error) => {
		console.error('Unable to connect to the database:', error);
	});

// (Optional) Synchronize models with database
sequelize
	.sync({ alter: true }) // Adjust schema without data loss
	.then(() => {
		console.log('Database synced successfully.');
	})
	.catch((error) => {
		console.error('Error syncing database:', error);
	});

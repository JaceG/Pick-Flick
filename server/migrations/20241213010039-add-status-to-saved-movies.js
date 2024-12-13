'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('saved_movies', 'status', {
			type: Sequelize.STRING,
			allowNull: true, // Allow null if necessary
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('saved_movies', 'status');
	},
};

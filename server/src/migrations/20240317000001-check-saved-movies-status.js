export const up = async (queryInterface, Sequelize) => {
	const transaction = await queryInterface.sequelize.transaction();

	try {
		// Check the current structure of the table
		const tableInfo = await queryInterface.describeTable('saved_movies');
		console.log('Current table structure:', tableInfo);

		// Check the current data in the status column
		const [results, metadata] = await queryInterface.sequelize.query(
			'SELECT DISTINCT status FROM saved_movies;'
		);
		console.log('Distinct status values:', results);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

export const down = async (queryInterface, Sequelize) => {
	// This migration doesn't make any changes, so down is empty
};

export const up = async (queryInterface, Sequelize) => {
	const transaction = await queryInterface.sequelize.transaction();

	try {
		// Add a new column 'status_integer'
		await queryInterface.addColumn(
			'saved_movies',
			'status_integer',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			{ transaction }
		);

		// Convert existing status values to integers
		await queryInterface.sequelize.query(
			`
        UPDATE saved_movies
        SET status_integer = CASE
          WHEN status = '0' OR status IS NULL THEN 0
          WHEN status = '1' THEN 1
          ELSE 0
        END
      `,
			{ transaction }
		);

		// Drop the old 'status' column
		await queryInterface.removeColumn('saved_movies', 'status', {
			transaction,
		});

		// Rename 'status_integer' to 'status'
		await queryInterface.renameColumn(
			'saved_movies',
			'status_integer',
			'status',
			{ transaction }
		);

		// Set NOT NULL constraint and default value
		await queryInterface.changeColumn(
			'saved_movies',
			'status',
			{
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			{ transaction }
		);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

export const down = async (queryInterface, Sequelize) => {
	const transaction = await queryInterface.sequelize.transaction();

	try {
		// Revert the changes
		await queryInterface.addColumn(
			'saved_movies',
			'status_string',
			{
				type: Sequelize.STRING,
				allowNull: true,
			},
			{ transaction }
		);

		await queryInterface.sequelize.query(
			`
        UPDATE saved_movies
        SET status_string = CAST(status AS VARCHAR)
      `,
			{ transaction }
		);

		await queryInterface.removeColumn('saved_movies', 'status', {
			transaction,
		});
		await queryInterface.renameColumn(
			'saved_movies',
			'status_string',
			'status',
			{ transaction }
		);

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

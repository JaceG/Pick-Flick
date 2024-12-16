export const up = async (queryInterface, Sequelize) => {
	const transaction = await queryInterface.sequelize.transaction();

	try {
		// Check the current structure of the table
		const tableInfo = await queryInterface.describeTable('saved_movies');
		console.log('Current table structure:', tableInfo);

		// If 'status' column already exists and is of type INTEGER, skip the migration
		if (tableInfo.status && tableInfo.status.type === 'INTEGER') {
			console.log(
				'Status column is already of type INTEGER. Skipping migration.'
			);
			await transaction.commit();
			return;
		}

		// Step 1: Add a new column 'status_integer'
		await queryInterface.addColumn(
			'saved_movies',
			'status_integer',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			{ transaction }
		);

		// Step 2: Update the new column with converted values
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

		// Step 3: Drop the old 'status' column
		await queryInterface.removeColumn('saved_movies', 'status', {
			transaction,
		});

		// Step 4: Rename 'status_integer' to 'status'
		await queryInterface.renameColumn(
			'saved_movies',
			'status_integer',
			'status',
			{ transaction }
		);

		// Step 5: Set NOT NULL constraint and default value
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
		// Revert the changes if needed
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

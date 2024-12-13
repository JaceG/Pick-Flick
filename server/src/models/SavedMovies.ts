import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

// Define the attributes for the SavedMovie model
interface SavedMovieAttributes {
	id: number;
	userId: number;
	movieId: string;
	title: string;
	poster?: string;
	genres: string[];
	releaseYear?: string;
	synopsis?: string;
	runtime?: number;
	cast?: string[];
	directors?: string[];
	producers?: string[];
	streaming?: { [key: string]: any }[]; // Streaming options as an array of objects
	status?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

// Define creation attributes for the model (fields that are optional when creating)
interface SavedMovieCreationAttributes
	extends Optional<
		SavedMovieAttributes,
		| 'id'
		| 'poster'
		| 'releaseYear'
		| 'synopsis'
		| 'runtime'
		| 'cast'
		| 'directors'
		| 'producers'
		| 'streaming'
		| 'createdAt'
		| 'updatedAt'
	> {}

// Extend the Sequelize Model class
class SavedMovie
	extends Model<SavedMovieAttributes, SavedMovieCreationAttributes>
	implements SavedMovieAttributes
{
	public id!: number;
	public userId!: number;
	public movieId!: string;
	public title!: string;
	public poster!: string;
	public genres!: string[];
	public releaseYear!: string;
	public synopsis!: string;
	public runtime!: number;
	public cast!: string[];
	public directors!: string[];
	public producers!: string[];
	public streaming!: { [key: string]: any }[];
	public status!: number;

	// Timestamps
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

// Initialize the model with Sequelize
SavedMovie.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		movieId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		poster: {
			type: DataTypes.STRING,
		},
		genres: {
			type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings for genres
			allowNull: false,
		},
		releaseYear: {
			type: DataTypes.STRING,
		},
		synopsis: {
			type: DataTypes.TEXT,
		},
		runtime: {
			type: DataTypes.INTEGER,
		},
		cast: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},
		directors: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},
		producers: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},
		streaming: {
			type: DataTypes.JSONB, // Use JSONB for storing complex objects
		},
		status: {
			type: DataTypes.INTEGER, // Use JSONB for storing complex objects
			defaultValue: 0,
		},
	},
	{
		sequelize, // Pass the Sequelize instance
		modelName: 'SavedMovie', // Model name
		tableName: 'saved_movies', // Table name in the database
		timestamps: true, // Enable createdAt and updatedAt
	}
);

export default SavedMovie;

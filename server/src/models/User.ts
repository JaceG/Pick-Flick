import { DataTypes, Model, Sequelize } from 'sequelize';

interface UserAttributes {
	id?: number;
	username: string;
	email: string;
	password: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
	public id!: number;
	public username!: string;
	public email!: string;
	public password!: string;
}

export const initUserModel = (sequelize: Sequelize) => {
	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'User',
		}
	);
};

import mongoose from "mongoose";
import validator_pkg from "validator";

const schema = new mongoose.Schema(
	{
		username: {
			type: String,
			trim: true,
			minLength: 2,
			maxLength: 32,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			trim: true,
			minLength: 5,
			required: true,
			unique: true,
			validate: {
				validator: (email) => {
					return validator_pkg.isEmail(email);
				},
				message: (props) => `${props.value} is not a valid email!`,
			},
		},
		firstName: {
			type: String,
			trim: true,
			minLength: 1,
			required: true,
			alias: "name",
		},
		lastName: {
			type: String,
			trim: true,
			minLength: 1,
			required: true,
			alias: "surname",
		},
		password: {
			type: String,
			minLength: 8,
			maxLength: 20,
			required: true,
			validate: {
				validator: (password) => {
					return /^\$2[ayb]?\$[0-9]{2}\$[A-Za-z0-9\.\/]/.test(
						password
					);
				},
				message: () => `Password must be a hash!`,
			},
		},
		sessions: {
			type: [String],
			default: [],
		},
		dob: {
			type: Date,
			required: true,
			validate: {
				validator: (date) => {
					const maxDate = new Date();
					maxDate.setFullYear(maxDate.getFullYear() - 13);
					return date <= maxDate;
				},
				message: (props) =>
					`DoB (${props.value}) is less than 13 years.`,
			},
			alias: "dateofbirth",
		},
		ratings: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Rating",
				},
			],
			default: [],
		},
		tunes: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Tune",
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", schema);

export default User;

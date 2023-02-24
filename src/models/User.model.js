import mongoose from "mongoose";
import validator_pkg from "validator";
import Role from "../constants/roles.json" assert { type: "json" };
import newID from "../utils/snowflake.js";

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
		role: {
			type: Number,
			enum: Object.values(Role),
			default: Role.USER,
			alias: "permissionLevel",
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
		methods: {
			async createSession() {
				const sessionId = newID();
				this.sessions.push(sessionId);
				await this.save();
				return sessionId;
			},
			async removeSession(session) {
				const newSessions = this.sessions.filter(
					(ses) => ses !== session
				);
				const removed = this.sessions.length > newSessions.length;
				this.sessions = newSessions;
				await this.save();
				return removed;
			},
		},
	}
);

const User = mongoose.model("User", schema);

export default User;

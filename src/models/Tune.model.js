import mongoose from "mongoose";
import GENRES from "../constants/genres";
import TAGS from "../constants/tags";

const schema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		private: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			trim: true,
			minLength: 5,
			maxLength: 64,
			required: true,
		},
		genre: {
			type: String,
			trim: true,
			uppercase: true,
			enum: GENRES,
			required: true,
		},
		tags: {
			type: [
				{
					type: String,
					trim: true,
					uppercase: true,
					enum: TAGS,
				},
			],
			default: [],
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
		bpm: {
			type: Number,
			default: 120,
		},
		tempo: {
			type: String,
			trim: true,
			default: "1m",
		},
		tracks: {
			type: [
				{
					type: { type: String },
					notes: [String],
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

const Tune = mongoose.model("Tune", schema);

export default Tune;

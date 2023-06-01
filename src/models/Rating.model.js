import mongoose from "mongoose";

const schema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		tune: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tune",
		},
		value: {
			type: Number,
			default: 1,
			min: 1,
			max: 5,
		},
	},
	{
		timestamps: true,
	}
);

const Rating = mongoose.model("Rating", schema);

export default Rating;

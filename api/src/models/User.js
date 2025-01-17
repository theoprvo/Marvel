const mongoose = require("mongoose");

const regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const favoriteSchema = new mongoose.Schema({
  favoriteType: {
    type: String,
    required: true,
  },
  favoriteID: {
    type: String,
    required: true,
  },
});

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minLength: [3, "Username must be at least 3 characters long"],
    maxLength: [15, "Username must be maximum 15 characters long"],
  },
  favorites: [favoriteSchema],
});

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      match: [regx, "Please provide a valid email address"],
    },
    account: accountSchema,
    hash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);

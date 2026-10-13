import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiraEm: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

const PasswordResetModel = mongoose.model(
  "PasswordReset",
  passwordResetSchema,
);

export default PasswordResetModel;

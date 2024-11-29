import mongoose, { Schema } from "mongoose";

export interface IPerson {
  name: string;
  email: string;
  age: number;
  phone?: number;
  bio?: string;
}

export const PersonSchema = new Schema<IPerson>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: false,
    default: 0,
  },
  bio: {
    type: String,
    required: false,
    default: "",
  },
});

export const persons = mongoose.model<IPerson>("Person", PersonSchema);

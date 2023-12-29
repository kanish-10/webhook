import User from "@/database/user.schema";
import { connectToDb } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function createUser(userData: any) {
  try {
    connectToDb();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function updateUser(params: any) {
  try {
    connectToDb();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function deleteUser(params: any) {
  try {
    connectToDb();

    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("❌🔍 User not found 🔍❌");
    }

    /**
     *  Delete user from database
     *  It means questions, answers, commnets, etc
     *
     */
    // get user question ids

    // ?  const userQuestionIds = await Question.find({
    // ?    author: user._id
    // ?  }).distinct('_id');

    // ⬆️ distinct | create a distinct query, meaning return
    // distinct values of the given field that mathces this filter

    // TODO: delete user answers, comments, etc

    // delete user
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

import { db } from "~/api/db";
import { Users, Challenges, UserChallenges } from "./schema";

async function deleteAllData() {
	console.log("Deleting all data...");

	// Delete all data from the Users table
	await db.delete(Users).execute();
	console.log("Deleted all data from Users table");

	// Delete all data from the Challenges table
	await db.delete(Challenges).execute();
	console.log("Deleted all data from Challenges table");

	// Delete all data from the UserChallenges table
	await db.delete(UserChallenges).execute();
	console.log("Deleted all data from UserChallenges table");

	console.log("Data deletion complete.");
}

deleteAllData()
	.then(() => {
		console.log("🌱 All data deleted successfully");
	})
	.catch((error) => {
		console.error("Error deleting data:", error);
	});

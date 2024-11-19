import { db } from "~/api/db";
import { Challenges, UserChallenges, Users } from "./schema";
import { Argon2id } from "oslo/password";

async function seedDatabase() {
	const argon2id = new Argon2id();
	const defaultPassword = await argon2id.hash("Tester123!");

	// Seed the Users table with a default user
	await db
		.insert(Users)
		.values([{ id: 1, username: "tester", password: defaultPassword }])
		.execute();

	// Seed the Challenges table with a default challenge
	await db
		.insert(Challenges)
		.values([
			{
				id: 1,
				name: "Reaction Speed Challenge",
				description:
					"A rigorous assessment of your reflexes and response time. In this exercise, your objective is to swiftly click on blue dots that appear on the screen at unpredictable intervals. The quicker and more accurately you respond, the better your performance will be. This challenge is designed to measure your reaction time and focus, offering valuable insights into your ability to respond under pressure. Are you prepared to demonstrate your precision and speed?",
			},
			{
				id: 2,
				name: "Number Guessing Game",
				description:
					"An exciting game that tests your ability to guess a randomly generated number within a specific range. In this challenge, you must predict the correct number between 1 and 100. With each incorrect guess, you will receive hints to guide you in the right direction. The fewer attempts you make, the higher your score will be. This challenge is designed to assess your logical reasoning and problem-solving skills. Can you outsmart the system and achieve a perfect score?",
			},
		])
		.execute();

	// Seed the UserChallenges table with a default score
	await db
		.insert(UserChallenges)
		.values([{ userId: 1, challengeId: 1, score: 95 }])
		.execute();
}

console.log("Started database seeding...");
seedDatabase()
	.then(() => {
		console.log("🌱 Database seeded successfully");
	})
	.catch((error) => {
		console.error("Error seeding database:", error);
	});

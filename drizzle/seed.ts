import { db } from "~/api/db";
import { Challenges, UserChallenges, Users } from "./schema";
import { Argon2id } from "oslo/password";

async function seedDatabase() {
	const argon2id = new Argon2id();
	const defaultPassword = await argon2id.hash("Tester123!");

	await db
		.insert(Challenges)
		.values([
			{
				id: 2,
				name: "Find Laika",
				description:
					"Laika is a Soviet space dog who became one of the first animals in space and the first animal to orbit the Earth. Laika, a stray dog from the streets of Moscow, was selected to be the occupant of the Soviet spacecraft Sputnik 2 that was launched into outer space on November 3, 1957. This challenge is designed to test your ability to find Laika in a series of images. Can you spot Laika in each picture?",
			},
			{
				id: 3,
				name: "Satellite guide",
				description:
					"In this challenge, you will be presented with a series of satellite images. Your task is to identify the location of the satellite in each image. The images will be taken from various locations around the world, and you will need to use your knowledge of geography and landmarks to determine where the satellite is located. Are you ready to put your map-reading skills to the test?",
			},
		])
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

import "./profile.scss";
import NavBar from "../NavBar/NavBar";
import Container from "../Container";
import { createAsync } from "@solidjs/router";
import { getUser, getUserChallengeScores } from "~/api/server";

// Trophy Icon Mapping Function
function getTrophyIcon(score: number | null) {
	if (score === null) return "none.png"; // Placeholder for unattempted challenges
	if (score < 10) return "bronze.png";
	if (score < 50) return "silver.png";
	if (score < 100) return "gold.png";
	return "none.png";
}

const Profile = ({ user }: { user: any }) => {
	const score = createAsync(async () => getUserChallengeScores(), { deferStream: true });

	return (
		<>
			<NavBar />
			<div class="trophyContainer">
				<div class="profile">
					<img
						class="userIcon"
						src={`https://ui-avatars.com/api/?name=${user.username || "Guest"}&background=random`}
						alt={`${user.username || "Guest"}'s Avatar`}
					/>
					<h1>{user.username}</h1>
				</div>
				<div class="trophyCase">
					<h2>My Challenges: </h2>
					{score.loading && <p>Loading scores...</p>}
					{score.error && <p>Error loading scores: {score.error.message}</p>}
					{score() && (
						<div class="trophy-grid">
							{score().map((challenge) => (
								<div key={challenge.challengeId} class="trophy-item">
									<img
										src={`/images/${getTrophyIcon(challenge.userScore)}`}
										alt={`${challenge.challengeName} trophy`}
										class="trophy-icon"
									/>
									<p class="trophy-title">{challenge.challengeName}</p>
									<p>
										{challenge.userScore ? "Your score: " + challenge.userScore : "Try this challenge to earn a score!"}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Profile;

import "./profile.scss";
import NavBar from "../NavBar/NavBar";
import Container from "../Container";
import { createAsync } from "@solidjs/router";
import { getUserChallengeScores } from "~/api/server";

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
			<Container>
				<div class="trophyCase">
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
								</div>
							))}
						</div>
					)}
				</div>
			</Container>
		</>
	);
};

export default Profile;

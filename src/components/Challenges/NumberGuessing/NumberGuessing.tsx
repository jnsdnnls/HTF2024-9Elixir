import { createSignal } from "solid-js";
import "./NumberGuessing.scss";
import Container from "~/components/Container";
import NavBar from "~/components/NavBar/NavBar";
import { action, createAsync, useAction } from "@solidjs/router";
import { getChallenge, upsertUserChallenge as uUc } from "~/api/server"; // Make sure this is imported correctly
import { ChallengesMap } from "~/constants";

// Action to handle the score submission to the backend
export const upsertUserChallenge = action(uUc, "upsertUserChallenge");

const NumberGuessingGame = () => {
	const submit = useAction(upsertUserChallenge); // Submit action for updating user challenge

	// Signals for game state
	const [guess, setGuess] = createSignal<number>(0);
	const [targetNumber, setTargetNumber] = createSignal<number>(Math.floor(Math.random() * 100) + 1);
	const [message, setMessage] = createSignal<string>("Guess a number between 1 and 100");
	const [attempts, setAttempts] = createSignal<number>(0);
	const [gameOver, setGameOver] = createSignal<boolean>(false);
	const [score, setScore] = createSignal<number>(0);

	// Handle guess input change
	const handleGuessChange = (event: Event) => {
		const input = (event.target as HTMLInputElement).value;
		setGuess(Number(input));
	};

	// Handle guess submission and scoring
	const handleSubmit = () => {
		if (gameOver()) return;

		const currentGuess = guess();
		setAttempts(attempts() + 1);

		if (currentGuess < targetNumber()) {
			setMessage("Too low! Try again.");
		} else if (currentGuess > targetNumber()) {
			setMessage("Too high! Try again.");
		} else {
			// Correct guess
			setMessage(`Correct! You guessed it in ${attempts() + 1} attempts.`);
			setGameOver(true);
			setScore(attempts() + 1); // Store score as the number of attempts
			// Submit the score to backend when the game is over
			submit(ChallengesMap.NumberGuessing, score()); // Ensure challengeId is passed correctly, if needed
		}
	};

	// Render the game
	return (
		<>
			<div class="intro-container">
				<NavBar />
				<Container>
					<div style={{ textAlign: "center", padding: "20px" }}>
						<h1>Number Guessing Game</h1>
						<p>{message()}</p>

						{!gameOver() ? (
							<>
								<input
									type="number"
									value={guess()}
									onInput={handleGuessChange}
									min="1"
									max="100"
									placeholder="Enter your guess"
									disabled={gameOver()}
								/>
								<br />
								<button onClick={handleSubmit}>Submit Guess</button>
							</>
						) : (
							<div>
								<h2>Game Over!</h2>
								<p>Your Score: {score()}</p>
								<button onClick={() => window.location.reload()}>Play Again</button>
							</div>
						)}
						<p>Attempts: {attempts()}</p>
					</div>
				</Container>
			</div>
		</>
	);
};

export default NumberGuessingGame;

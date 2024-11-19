import { createEffect, createSignal, onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { useAction } from "@solidjs/router";
import { upsertUserChallenge } from "~/api/server"; // Assuming this function is the same as in your code
import { ChallengesMap } from "~/constants";

import "./ColorMatch.scss"; // Styling for the game
import NavBar from "~/components/NavBar/NavBar";
import Container from "~/components/Container";

const ColorMatchChallenge = () => {
	const submit = useAction(upsertUserChallenge);
	const [score, setScore] = createSignal(0);
	const [timeLeft, setTimeLeft] = createSignal(30);
	const [gameOver, setGameOver] = createSignal(false);
	const [isStarted, setIsStarted] = createSignal(false);
	const [backgroundColor, setBackgroundColor] = createSignal("");
	const [shapes, setShapes] = createSignal<string[]>([]);

	const colors = ["red", "green", "blue", "yellow", "orange", "purple", "pink", "brown", "cyan", "lime"];

	const generateRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

	const generateShapes = () => {
		const targetColor = generateRandomColor();
		setBackgroundColor(targetColor);

		const shapeColors = [targetColor, generateRandomColor(), generateRandomColor(), generateRandomColor()];
		// Shuffle shapes so the target color isn't always first
		setShapes(shapeColors.sort(() => Math.random() - 0.5));
	};

	createEffect(() => {
		if (isStarted() && !gameOver()) {
			const timerInterval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						setGameOver(true);
						clearInterval(timerInterval);
						submit(ChallengesMap.colorMatchChallenge, score());
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			onCleanup(() => {
				clearInterval(timerInterval);
			});

			generateShapes();
		}
	});

	const handleShapeClick = (color: string) => {
		if (color === backgroundColor()) {
			setScore(score() + 1);
		}
		generateShapes();
	};

	return (
		<div>
			{isStarted() ? (
				<div class="game-container">
					{!gameOver() ? (
						<>
							<div class="score-card">
								<p>Score: {score()}</p>
								<p>Time Left: {timeLeft()}s</p>
							</div>
							<div class="game-area" style={{ backgroundColor: backgroundColor() }}>
								<div class="shapes-container">
									{shapes().map((color) => (
										<div class="shape" style={{ backgroundColor: color }} onClick={() => handleShapeClick(color)} />
									))}
								</div>
							</div>
						</>
					) : (
						<div class="result">
							<h2>Time's up! Your Score: {score()}</h2>
							<A href="/">
								<button>Return Home</button>
							</A>
						</div>
					)}
				</div>
			) : (
				<div class="intro-container">
					<NavBar />
					<Container>
						<h1>Color Match Challenge</h1>
						<p>Click the shape that matches the background color!</p>
						<button type="button" onClick={() => setIsStarted(true)}>
							Start
						</button>
					</Container>
				</div>
			)}
		</div>
	);
};

export default ColorMatchChallenge;

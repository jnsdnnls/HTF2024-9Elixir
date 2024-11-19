import { generateRandomInteger } from "oslo/crypto";
import { createSignal, onMount } from "solid-js";

const FindLaika = () => {
	const [planets, setPlanets] = createSignal([]);
	const [laika, setLaika] = createSignal(null);
	const [timer, setTimer] = createSignal(0);
	const [gameStarted, setGameStarted] = createSignal(false);
	const [score, setScore] = createSignal(null);

	let interval;

	// Function to generate a random position within screen bounds
	const randomPosition = () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const x = Math.floor(Math.random() * (width - 100)); // Adjust for image size
		const y = Math.floor(Math.random() * (height - 100));
		return { x, y };
	};

	// Function to generate a random planet image
	const randomImage = () => {
		const randomNum = Math.floor(Math.random() * 6) + 1; // Assuming 6 planet images
		return `/public/images/planets/planet${randomNum}.webp`;
	};

	// Generate random planets
	const generatePlanets = () => {
		const generatedPlanets = Array.from({ length: 100 }, () => ({
			image: randomImage(),
			position: randomPosition(),
			id: Math.random().toString(36).substr(2, 9), // Unique ID for each planet
		}));
		setPlanets(generatedPlanets);
	};

	// Start the game
	const startGame = () => {
		setGameStarted(true);
		setScore(null);
		generatePlanets();
		spawnLaika();
		setTimer(0);

		interval = setInterval(() => {
			setTimer((prev) => prev + 1);
		}, 1000);
	};

	// Stop the game
	const stopGame = () => {
		clearInterval(interval);
		setGameStarted(false);
	};

	// Spawn Laika randomly on the screen
	const spawnLaika = () => {
		setLaika({
			image: `/public/images/laika.webp`,
			position: randomPosition(),
		});
	};

	// Handle clicking Laika
	const handleLaikaClick = () => {
		stopGame();
		setScore(timer());
		setLaika(null); // Hide Laika
	};

	// Cleanup interval on unmount
	onMount(() => {
		return () => {
			clearInterval(interval);
		};
	});

	return (
		<div
			className="container"
			style={{
				width: "100vw",
				height: "100vh",
				position: "relative",
				overflow: "hidden",
				backgroundColor: "#000",
			}}
		>
			<h1
				style={{
					position: "absolute",
					top: "10px",
					left: "50%",
					transform: "translateX(-50%)",
					color: "#fff",
					zIndex: 1000,
				}}
			>
				Find Laika
			</h1>

			{!gameStarted() ? (
				<button
					onClick={startGame}
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						padding: "10px 20px",
						fontSize: "18px",
						cursor: "pointer",
					}}
				>
					Start Game
				</button>
			) : (
				<>
					<div
						style={{
							position: "absolute",
							top: "10px",
							right: "10px",
							color: "#fff",
							fontSize: "20px",
						}}
					>
						Timer: {timer()}s
					</div>

					{score() !== null && (
						<div
							style={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								color: "#fff",
								fontSize: "24px",
							}}
						>
							You found Laika in {score()} seconds!
						</div>
					)}

					{planets().map((planet) => (
						<img
							key={planet.id}
							src={planet.image}
							class="planet"
							alt="Planet"
							style={{
								position: "absolute",
								left: `${planet.position.x}px`,
								top: `${planet.position.y}px`,
								width: "200px",
								height: "100px",
							}}
						/>
					))}

					{laika() && (
						<img
							src={laika().image}
							alt="Laika"
							onClick={handleLaikaClick}
							style={{
								position: "absolute",
								left: `${laika().position.x}px`,
								top: `${laika().position.y}px`,
								width: "100px",
								height: "100px",
								cursor: "pointer",
								zIndex: generateRandomInteger(1, 100), // Randomize z-index
							}}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default FindLaika;

import { createSignal, createEffect, onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { upsertUserChallenge } from "~/api/server";
import { ChallengesMap } from "~/constants";

const SatelliteGuide = () => {
	const [satellites, setSatellites] = createSignal([
		{ id: 1, angle: 0 },
		{ id: 2, angle: 45 },
		{ id: 3, angle: 90 },
	]);
	const [laserPosition, setLaserPosition] = createSignal({ top: 50, left: 10 });
	const [laserAngle, setLaserAngle] = createSignal(0);
	const [score, setScore] = createSignal(0);
	const [timeLeft, setTimeLeft] = createSignal(30);
	const [gameOver, setGameOver] = createSignal(false);
	const [isStarted, setIsStarted] = createSignal(false);

	const generateLaserPath = () => {
		let angle = laserAngle();
		let posX = laserPosition().left;
		let posY = laserPosition().top;

		satellites().forEach((satellite) => {
			if (angle >= satellite.angle) {
				angle += satellite.angle;
				posX += 10; // Move the laser horizontally
				posY += 10; // Move the laser vertically
			}
		});

		setLaserPosition({ top: posY, left: posX });
		setLaserAngle(angle);
	};

	createEffect(() => {
		if (isStarted() && !gameOver()) {
			const timerInterval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						setGameOver(true);
						clearInterval(timerInterval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			onCleanup(() => {
				clearInterval(timerInterval);
			});
		}
	});

	const handleSatelliteRotation = (id: number) => {
		setSatellites(
			satellites().map((satellite) =>
				satellite.id === id ? { ...satellite, angle: (satellite.angle + 45) % 360 } : satellite
			)
		);
	};

	const checkLaserHit = () => {
		// If laser hits target, finish game
		if (laserPosition().top > 80 && laserPosition().left > 80) {
			setScore(score() + 1);
			setGameOver(true);
			upsertUserChallenge(ChallengesMap.laserRedirectChallenge, score());
		}
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
							<div class="game-area">
								{satellites().map((satellite) => (
									<Satellite id={satellite.id} angle={satellite.angle} onRotate={handleSatelliteRotation} />
								))}
								<Laser position={laserPosition()} angle={laserAngle()} />
							</div>
						</>
					) : (
						<div class="result">
							<h2>Game Over! Your Score: {score()}</h2>
							<A href="/">
								<button>Return home</button>
							</A>
						</div>
					)}
				</div>
			) : (
				<div class="intro-container">
					<h1>Laser Redirect Challenge</h1>
					<p>Use the satellites to redirect the laser beam to hit the target!</p>
					<button type="button" onClick={() => setIsStarted(true)}>
						Start
					</button>
				</div>
			)}
		</div>
	);
};

export default SatelliteGuide;

type SatelliteProps = {
	id: number;
	angle: number;
	onRotate: (id: number) => void;
};

const Satellite = ({ id, angle, onRotate }: SatelliteProps) => {
	return <div class="satellite" style={{ transform: `rotate(${angle}deg)` }} onClick={() => onRotate(id)} />;
};

type LaserProps = {
	position: { top: number; left: number };
	angle: number;
};

const Laser = ({ position, angle }: LaserProps) => {
	return (
		<div
			class="laser"
			style={{
				top: `${position.top}vh`,
				left: `${position.left}vw`,
				transform: `rotate(${angle}deg)`,
			}}
		/>
	);
};

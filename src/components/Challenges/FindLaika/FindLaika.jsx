import { createSignal, onMount } from "solid-js";

const FindLaika = () => {
  const [planets, setPlanets] = createSignal([]);
  const [laikas, setLaikas] = createSignal([]);
  const [timer, setTimer] = createSignal(0);
  const [gameStarted, setGameStarted] = createSignal(false);
  const [score, setScore] = createSignal(null);
  const [draggingPlanet, setDraggingPlanet] = createSignal(null);
  const [laikasFound, setLaikasFound] = createSignal(0); // Track found Laikas
  const totalLaikas = 5; // Total number of Laikas to find

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
    setLaikasFound(0); // Reset found Laikas count
    generatePlanets();
    spawnLaikas();
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

  // Spawn multiple Laikas randomly on the screen
  const spawnLaikas = () => {
    const generatedLaikas = Array.from({ length: totalLaikas }, () => ({
      image: `/public/images/laika.webp`,
      position: randomPosition(),
      id: Math.random().toString(36).substr(2, 9), // Unique ID for each Laika
    }));
    setLaikas(generatedLaikas);
  };

  // Handle clicking Laika
  const handleLaikaClick = (laikaId) => {
    const updatedLaikas = laikas().filter((laika) => laika.id !== laikaId);
    setLaikas(updatedLaikas);
    setLaikasFound(laikasFound() + 1); // Increment Laikas found count

    if (updatedLaikas.length === 0) {
      setScore(timer()); // All Laikas found, set score
      clearInterval(interval); // Stop the timer
    }
  };

  // Handle dragging planets
  const handleDragStart = (e, planetId) => {
    const planetIndex = planets().findIndex((planet) => planet.id === planetId);
    if (planetIndex === -1) return;

    const updatedPlanets = [...planets()];
    updatedPlanets[planetIndex].dragOffset = {
      x: e.clientX - updatedPlanets[planetIndex].position.x,
      y: e.clientY - updatedPlanets[planetIndex].position.y,
    };
    setDraggingPlanet(planetId);
    setPlanets(updatedPlanets);
  };

  const handleDragMove = (e) => {
    const planetId = draggingPlanet();
    if (!planetId) return;

    const planetIndex = planets().findIndex((planet) => planet.id === planetId);
    if (planetIndex === -1) return;

    const updatedPlanets = [...planets()];
    const dragOffset = updatedPlanets[planetIndex].dragOffset;

    updatedPlanets[planetIndex].position = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };
    setPlanets(updatedPlanets);
  };

  const handleDragEnd = () => {
    setDraggingPlanet(null);
  };

  // Cleanup interval on unmount
  onMount(() => {
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
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
                fontSize: "36px", // Larger font for score
              }}
            >
              You found all Laikas in {score()} seconds!
            </div>
          )}

          {planets().map((planet) => (
            <img
              key={planet.id}
              src={planet.image}
              alt="Planet"
              style={{
                position: "absolute",
                left: `${planet.position.x}px`,
                top: `${planet.position.y}px`,
                width: "200px",
                height: "100px",
                cursor: "grab",
                zIndex: 1, // Lower than Laika's z-index
              }}
              onMouseDown={(e) => handleDragStart(e, planet.id)}
            />
          ))}

          {laikas().map((laika) => (
            <img
              key={laika.id}
              src={laika.image}
              alt="Laika"
              onClick={() => handleLaikaClick(laika.id)}
              style={{
                position: "absolute",
                left: `${laika.position.x}px`,
                top: `${laika.position.y}px`,
                width: "100px",
                height: "100px",
                cursor: "pointer",
                zIndex: 0, // Laika is behind planets
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default FindLaika;

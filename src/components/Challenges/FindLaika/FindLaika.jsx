import { createSignal, onMount } from "solid-js";

const FindLaika = () => {
  const [planet, setPlanet] = createSignal(null);

  onMount(() => {
    // Simulating fetching data (if dynamic data is needed)
    setPlanet({
      image: "https://images.unsplash.com/photo-1560807707-9b1b5e07d51d",
    });
  });

  return (
    <div className="container">
      <h1>Find Laika</h1>
      {planet() ? (
        <>
          <img src={planet().image} alt="Planet" />
          <div className="planet" draggable="true"></div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FindLaika;

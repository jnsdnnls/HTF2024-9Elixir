const planet = {
  image: "https://images.unsplash.com/photo-1560807707-9b1b5e07d51d",
};

return (
  <div className="container">
    <h1>Find Laika</h1>
    <img src={planet.image} alt="Planet" />
    <div className="planet" draggable="true"></div>
  </div>
);

export default FindLaika;

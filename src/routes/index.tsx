import { createResource, createSignal, Show } from "solid-js";
import { getChallenges } from "~/api/server";
import NavBar from "~/components/NavBar/NavBar";

export default function HomeRoute() {
	const [challenges] = createResource(getChallenges); // Resource voor alle challenges
	const [searchQuery, setSearchQuery] = createSignal(""); // State voor zoekopdracht

	return (
		<>
			<NavBar />
		</>
	);
}

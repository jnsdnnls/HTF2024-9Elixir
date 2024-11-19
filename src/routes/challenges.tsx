import { A } from "@solidjs/router";
import { createResource, createSignal, Show } from "solid-js";
import { getChallenges } from "~/api/server";
import ChallengeCard from "~/components/ChallengeCard/ChallengeCard";
import Container from "~/components/Container";
import NavBar from "~/components/NavBar/NavBar";

export default function challenges() {
	const [challenges] = createResource(getChallenges); // Resource voor alle challenges
	const [searchQuery, setSearchQuery] = createSignal(""); // State voor zoekopdracht

	// Filter challenges op basis van de zoekterm
	const filteredChallenges = () =>
		challenges()?.filter((challenge) => challenge.name.toLowerCase().includes(searchQuery().toLowerCase()));

	return (
		<>
			<NavBar />
			<Container>
				<Show when={challenges()} fallback={"Loading..."}>
					{/* Zoekbalk */}
					<input
						type="text"
						placeholder="Search challenges..."
						value={searchQuery()}
						onInput={(e) => setSearchQuery(e.target.value)}
						style={{
							width: "100%",
							padding: "10px",
							marginBottom: "20px",
							fontSize: "16px",
							borderRadius: "5px",
							border: "1px solid #ccc",
						}}
					/>

					{/* Gefilterde lijst met challenges */}
					<div>
						{filteredChallenges()?.map((challenge) => (
							<A href={`/${challenge.name.replace(/\s+/g, "-")}`}>
								{" "}
								{/* Replace spaces with hyphens */}
								<ChallengeCard challenge={challenge} />
							</A>
						))}
					</div>
				</Show>
			</Container>
		</>
	);
}

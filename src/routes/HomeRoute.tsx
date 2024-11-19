import { A } from "@solidjs/router";
import { createResource, createSignal, Show } from "solid-js";
import { getChallenges } from "~/api/server";
import ChallengeCard from "~/components/ChallengeCard/ChallengeCard";
import Container from "~/components/Container";
import NavBar from "~/components/NavBar/NavBar";

export default function HomeRoute() {
  const [challenges] = createResource(getChallenges);
  const [searchQuery, setSearchQuery] = createSignal("");

  const filteredChallenges = () =>
    challenges()?.filter((challenge) =>
      challenge.name.toLowerCase().includes(searchQuery().toLowerCase())
    );

  return (
    <>
      <NavBar />
      <Container>
        <Show when={challenges()} fallback={"Loading..."}>
          <div>
            {/* Search Bar */}
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

            {/* Filtered Challenge List */}
            {filteredChallenges()?.map((challenge) => (
              <A href="/reaction-speed-challenge">
                <ChallengeCard challenge={challenge} />
              </A>
            ))}
          </div>
        </Show>
      </Container>
    </>
  );
}

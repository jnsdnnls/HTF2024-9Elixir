import { getUser, logout } from "~/api";
import "./NavBar.css";
import { A, createAsync } from "@solidjs/router";
import Container from "../Container";

const NavBar = () => {
	const user = createAsync(async () => getUser(), { deferStream: true });
	return (
		<>
			{user() && (
				<div class="wrapper">
					<Container>
						<form action={logout} method="post">
							<A href="/">
								<img class="logo" src="../../9_elixir.png" alt="Space Cadet Program" />
							</A>
							<div class="right">
								<A href="/">Home</A>
								<A href="/profile">Profile</A>
								<A href="/challenges">Challenges</A>
								<button name="logout" type="submit">
									Logout
								</button>
							</div>
						</form>
					</Container>
				</div>
			)}
		</>
	);
};

export default NavBar;

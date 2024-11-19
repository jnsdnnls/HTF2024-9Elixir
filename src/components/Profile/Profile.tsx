import { getUser, logout } from "~/api";
import { A, createAsync } from "@solidjs/router";
import "./profile.scss";
import NavBar from "../NavBar/NavBar";
import Container from "../Container";

const Profile = ({ user }: { user: any }) => {
	return (
		<>
			<NavBar />
			<Container>
				<div class="wrapper">
					<p>Username: {user.username}</p>
					<p>id: {user.id}</p>
				</div>
				<div class="trophyCase">
					<div class="trophy"></div>
				</div>
			</Container>
		</>
	);
};

export default Profile;

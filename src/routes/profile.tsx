import Profile from "~/components/Profile/Profile";
import { getUser, logout } from "~/api";
import { A, createAsync } from "@solidjs/router";

const profile = () => {
	const user = createAsync(async () => getUser(), { deferStream: true });
	return <>{user() && <Profile user={user()!} />}</>;
};

export default profile;

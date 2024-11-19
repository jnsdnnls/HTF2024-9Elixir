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
                <img
                  class="logo"
                  src="../../9_elixir.png"
                  alt="Space Cadet Program"
                />
              </A>
              <A href="/profile">Hello {user()!.username} 👋</A>
              <button name="logout" type="submit">
                Logout
              </button>
            </form>
          </Container>
        </div>
      )}
    </>
  );
};

export default NavBar;

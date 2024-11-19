import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { loginOrRegister } from "~/api";
import Container from "~/components/Container";

export default function LoginRoute(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);
  const [loginType, setLoginType] = createSignal("login"); // Keep track of the selected option

  return (
    <Container>
      <img
        class="logo-login"
        src="../../9_elixir.png"
        alt="Space Cadet Program"
      />
      <h1>Space Cadet Program</h1>
      <form action={loginOrRegister} method="post" class="login-form">
        <input
          type="hidden"
          name="redirectTo"
          value={props.params.redirectTo ?? "/"}
        />
        <input type="hidden" name="loginType" value={loginType()} />
        <fieldset>
          <div
            class="option"
            onClick={() => setLoginType("login")}
            style={{
              backgroundColor:
                loginType() === "login" ? "var(--clr-secondary)" : "var(--clr-primary)",
            }}
          >
            Login
          </div>
          <div
            class="option"
            onClick={() => setLoginType("register")}
            style={{
              backgroundColor:
                loginType() === "register" ? "var(--clr-secondary)" : "var(--clr-primary)",
            }}
          >
            Register
          </div>
        </fieldset>
        <div class="input-container">
          <label for="username">Username</label>
          <input type="text" name="username" autocomplete="username" />
        </div>
        <div class="input-container">
          <label for="password">Password</label>
          <input
            name="password"
            type="password"
            autocomplete="current-password"
          />
        </div>
        <button id="login-button" type="submit">
          {loginType() === "login" ? "Login" : "Register"}
        </button>
        <Show when={loggingIn.result}>
          <p style={{ color: "red" }} role="alert" id="error-message">
            {loggingIn.result!.message}
          </p>
        </Show>
      </form>
    </Container>
  );
}

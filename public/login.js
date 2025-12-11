import { setDiv, token, setToken, message, enableInput } from "./index.js";
import { showCountries } from "./countries.js";
import { showLoginRegister } from "./loginRegister.js";

let loginDiv = null;
let email = null;
let password = null;

export const handleLogin = () => {
  loginDiv = document.getElementById("login-div");
  email = document.getElementById("email");
  password = document.getElementById("password");

  const loginBtn = document.getElementById("login-btn");
  const cancelBtn = document.getElementById("login-cancel");

  loginDiv.addEventListener("click", async (e) => {
    if (e.target === loginBtn) {
      enableInput(false);

      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });

        const data = await response.json();

        if (response.status === 200) {
          setToken(data.token);
          showCountries();
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        message.textContent = "Network error.";
      }

      enableInput(true);
    }

    if (e.target === cancelBtn) {
      showLoginRegister();
    }
  });
};

export const showLogin = () => {
  email.value = "";
  password.value = "";
  setDiv(loginDiv);
};

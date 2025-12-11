import { setDiv, message, enableInput, setToken } from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showCountries } from "./countries.js";

let registerDiv = null;
let nameInput = null;
let email1 = null;
let password1 = null;
let password2 = null;

export const handleRegister = () => {
  registerDiv = document.getElementById("register-div");
  nameInput = document.getElementById("name");
  email1 = document.getElementById("email1");
  password1 = document.getElementById("password1");
  password2 = document.getElementById("password2");

  const registerBtn = document.getElementById("register-btn");
  const cancelBtn = document.getElementById("register-cancel");

  registerDiv.addEventListener("click", async (e) => {
    if (e.target === registerBtn) {
      if (password1.value !== password2.value) {
        message.textContent = "Passwords do not match.";
        return;
      }

      enableInput(false);

      try {
        const response = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameInput.value,
            email: email1.value,
            password: password1.value,
          }),
        });

        const data = await response.json();

        if (response.status === 201) {
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

export const showRegister = () => {
  email1.value = "";
  password1.value = "";
  password2.value = "";
  setDiv(registerDiv);
};

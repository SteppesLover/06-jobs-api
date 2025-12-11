import { inputEnabled, setDiv } from "./index.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";

let authDiv = null;
let loginBtn = null;
let registerBtn = null;

export const handleLoginRegister = () => {
  authDiv = document.getElementById("auth");
  loginBtn = document.getElementById("logon");
  registerBtn = document.getElementById("register");

  authDiv.addEventListener("click", (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === loginBtn) {
      showLogin();
    } else if (e.target === registerBtn) {
      showRegister();
    }
  });
};

export const showLoginRegister = () => {
  setDiv(authDiv);
};

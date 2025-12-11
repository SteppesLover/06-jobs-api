import { 
  inputEnabled,
  setDiv,
  message,
  token,
  enableInput,
  setToken,
} from "./index.js";

import { showLoginRegister } from "./loginRegister.js";
import { showAddEditCountry } from "./addEditCountry.js";

let countriesDiv = null;
let countriesTable = null;
let showAllBtn = null;
let logoffBtn = null;
let addCountryBtn = null;

export const handleCountries = () => {
  countriesDiv = document.getElementById("countries");
  countriesTable = document.getElementById("countries-table");

  showAllBtn = document.getElementById("show-all");
  logoffBtn = document.getElementById("logoff");
  addCountryBtn = document.getElementById("add-country");

  countriesDiv.addEventListener("click", (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === showAllBtn) {
      loadCountries();
    } 
    else if (e.target === logoffBtn) {
      setToken(null);
      showLoginRegister();
    } 
    else if (e.target === addCountryBtn) {
      showAddEditCountry(null);
    }
  });
};

export const showCountries = () => {
  setDiv(countriesDiv);
  loadCountries();
};

export const loadCountries = async () => {
  enableInput(false);

  try {
    const response = await fetch("/api/v1/countries", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      fillCountriesTable(data.countries);
      message.textContent = "";
    } else {
      message.textContent = data.msg || "Error loading countries";
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
};

const fillCountriesTable = (countries) => {
  while (countriesTable.rows.length > 1) {
    countriesTable.deleteRow(1);
  }

  countries.forEach((country) => {
    const row = countriesTable.insertRow();

    row.insertCell(0).textContent = country.name;
    row.insertCell(1).textContent = country.province;
    row.insertCell(2).textContent = country.governmentType;

    const editCell = row.insertCell(3);
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => showAddEditCountry(country);
    editCell.appendChild(editBtn);

    const deleteCell = row.insertCell(4);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteCountry(country._id);
    deleteCell.appendChild(deleteBtn);
  });
};

const deleteCountry = async (id) => {
  if (!confirm("Delete this country?")) return;

  enableInput(false);

  try {
    const response = await fetch(`/api/v1/countries/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      loadCountries();
    } else {
      const data = await response.json();
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
};


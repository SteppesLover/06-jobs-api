import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showCountries } from "./countries.js";

let addEditDiv = null;
let nameInput = null;
let provinceInput = null;
let governmentInput = null;
let saveButton = null;

export const handleAddEditCountry = () => {
  addEditDiv = document.getElementById("edit-country");

  nameInput = document.getElementById("country-name");
  provinceInput = document.getElementById("country-province");
  governmentInput = document.getElementById("country-gov");

  saveButton = document.getElementById("country-save");
  const cancelButton = document.getElementById("country-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === saveButton) {
      await saveCountry();
    } else if (e.target === cancelButton) {
      clearEditState();
      showCountries();
    }
  });
};


export const showAddEditCountry = async (countryId = null) => {
  message.textContent = "";

  if (!countryId) {
    addEditDiv.dataset.id = "";
    nameInput.value = "";
    provinceInput.value = "";
    governmentInput.value = "Barbarian";
    return setDiv(addEditDiv);
  }

  enableInput(false);

  try {
    const response = await fetch(`/api/v1/countries/${countryId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      nameInput.value = data.country.name;
      provinceInput.value = data.country.province;
      governmentInput.value = data.country.governmentType;

      addEditDiv.dataset.id = countryId;
      setDiv(addEditDiv);
    } else {
      message.textContent = "Country not found.";
      showCountries();
    }
  } catch (err) {
    message.textContent = "Network error.";
    showCountries();
  }

  enableInput(true);
};


async function saveCountry() {
  enableInput(false);

  const body = {
    name: nameInput.value,
    province: provinceInput.value,
    governmentType: governmentInput.value,
  };

  let method = "POST";
  let url = "/api/v1/countries";

  const id = addEditDiv.dataset.id;
  if (id) {
    method = "PATCH";
    url = `/api/v1/countries/${id}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      message.textContent = id
        ? "Country updated successfully."
        : "Country created successfully.";

      clearEditState();
      showCountries();
    } else {
      message.textContent = data.msg || "Error saving country.";
    }
  } catch (err) {
    message.textContent = "Network error.";
  }

  enableInput(true);
}

function clearEditState() {
  delete addEditDiv.dataset.id;
}

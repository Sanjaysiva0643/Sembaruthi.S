
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaults = {
  name: "Sanjay Siva",
  role: "Java Developer",
  about: "Welcome to my developer portfolio.",
  skills: ["Java", "HTML", "CSS", "JavaScript", "SQL"],
  projects: ["Portfolio Website", "Fingerprint ATM System"],
  experience: "Developer and IT professional.",
  email: "yourmail@example.com"
};

function showData(data) {
  document.getElementById("siteName").textContent = data.name;
  document.getElementById("heroName").textContent = data.name;
  document.getElementById("heroRole").textContent = data.role;
  document.getElementById("heroAbout").textContent = data.about;
  document.getElementById("aboutText").textContent = data.about;
  document.getElementById("emailText").textContent = data.email;
  document.getElementById("experienceText").textContent = data.experience;

  document.getElementById("skillsList").replaceChildren();
  (data.skills || []).forEach(skill => {
    const item = document.createElement("div");
    item.textContent = skill;
    document.getElementById("skillsList").appendChild(item);
  });

  document.getElementById("projectsList").replaceChildren();
  (data.projects || []).forEach(project => {
    const item = document.createElement("div");
    item.textContent = project;
    document.getElementById("projectsList").appendChild(item);
  });
}

showData(defaults);

try {
  const ref = doc(db, "portfolio", "public");
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) showData(snapshot.data());
} catch (error) {
  console.error("Portfolio loading error:", error);
}


import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth, signInWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const portfolioRef = doc(db, "portfolio", "public");

const loginForm = document.getElementById("loginForm");
const portfolioForm = document.getElementById("portfolioForm");
const statusText = document.getElementById("status");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "admin-dashboard.html";
    } catch (error) {
      document.getElementById("message").textContent =
        "Login failed: " + error.message;
    }
  });
}

if (portfolioForm) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "admin.html";
      return;
    }

    try {
      const snapshot = await getDoc(portfolioRef);
      if (snapshot.exists()) {
        const data = snapshot.data();

        document.getElementById("name").value = data.name || "";
        document.getElementById("role").value = data.role || "";
        document.getElementById("about").value = data.about || "";
        document.getElementById("skills").value =
          (data.skills || []).join(", ");
        document.getElementById("projects").value =
          (data.projects || []).join(", ");
        document.getElementById("experience").value =
          data.experience || "";
        document.getElementById("contactEmail").value = data.email || "";
      }
    } catch (error) {
      statusText.textContent = "Load error: " + error.message;
    }
  });

  portfolioForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!auth.currentUser) return;

    const data = {
      name: document.getElementById("name").value.trim(),
      role: document.getElementById("role").value.trim(),
      about: document.getElementById("about").value.trim(),
      skills: document.getElementById("skills").value
        .split(",").map(x => x.trim()).filter(Boolean),
      projects: document.getElementById("projects").value
        .split(",").map(x => x.trim()).filter(Boolean),
      experience: document.getElementById("experience").value.trim(),
      email: document.getElementById("contactEmail").value.trim()
    };

    try {
      await setDoc(portfolioRef, data);
      statusText.textContent = "Portfolio updated successfully!";
    } catch (error) {
      statusText.textContent = "Save error: " + error.message;
    }
  });
}

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "admin.html";
  });
}

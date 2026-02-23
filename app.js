import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYTyRBydwn-vZcHS_DAwluJT0imZNvvIM",
  authDomain: "khanta-traders.firebaseapp.com",
  projectId: "khanta-traders",
  storageBucket: "khanta-traders.firebasestorage.app",
  messagingSenderId: "767495287096",
  appId: "1:767495287096:web:e4a9f241ba3838880991cd",
  measurementId: "G-SWSN7CHW5C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* PASSWORD TOGGLE LOGIC */
const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordField.type === "password";
    passwordField.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "🙈" : "👁️";
  });
}

/* LOGIN LOGIC */
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = passwordField.value.trim();

    const email = username + "@khanta.local";

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.assign("dashboard.html");
      })
      .catch((error) => {
        document.getElementById("error").innerText = error.code;
      });
  });
}

/* AUTH STATE LISTENER */
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname.split("/").pop();
  if (!user && currentPage === "dashboard.html") {
    window.location.replace("index.html");
  }
  if (user && currentPage === "index.html") {
    window.location.replace("dashboard.html");
  }
});

/* LOGOUT LOGIC */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.replace("index.html");
    });
  });
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Extract the username from the email (e.g., admin from admin@khanta.local)
    const username = user.email.split('@')[0];
    const greetingElement = document.getElementById("userDisplayName");
    if (greetingElement) {
        greetingElement.innerText = username.charAt(0).toUpperCase() + username.slice(1);
    }
  }
  // ... rest of your redirection logic
});

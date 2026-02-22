[span_4](start_span)import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";[span_4](end_span)
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
[span_5](start_span)} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";[span_5](end_span)

const firebaseConfig = {
  [span_6](start_span)apiKey: "AIzaSyBYTyRBydwn-vZcHS_DAwluJT0imZNvvIM",[span_6](end_span)
  [span_7](start_span)authDomain: "khanta-traders.firebaseapp.com",[span_7](end_span)
  [span_8](start_span)projectId: "khanta-traders",[span_8](end_span)
  [span_9](start_span)storageBucket: "khanta-traders.firebasestorage.app",[span_9](end_span)
  [span_10](start_span)messagingSenderId: "767495287096",[span_10](end_span)
  [span_11](start_span)appId: "1:767495287096:web:e4a9f241ba3838880991cd",[span_11](end_span)
  [span_12](start_span)measurementId: "G-SWSN7CHW5C"[span_12](end_span)
};

[span_13](start_span)const app = initializeApp(firebaseConfig);[span_13](end_span)
[span_14](start_span)const auth = getAuth(app);[span_14](end_span)

/* PASSWORD TOGGLE LOGIC */
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    // Toggle the type attribute
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    
    // Toggle the icon
    togglePassword.textContent = type === "password" ? "👁️" : "🙈";
  });
}

/* LOGIN LOGIC */
[span_15](start_span)const loginBtn = document.getElementById("loginBtn");[span_15](end_span)
[span_16](start_span)if (loginBtn) {[span_16](end_span)
  [span_17](start_span)loginBtn.addEventListener("click", () => {[span_17](end_span)
    [span_18](start_span)const username = document.getElementById("username").value.trim();[span_18](end_span)
    [span_19](start_span)const password = passwordInput.value.trim();[span_19](end_span)

    [span_20](start_span)const email = username + "@khanta.local";[span_20](end_span)

    [span_21](start_span)signInWithEmailAndPassword(auth, email, password)[span_21](end_span)
      [span_22](start_span).then(() => {[span_22](end_span)
        [span_23](start_span)window.location.assign("dashboard.html");[span_23](end_span)
      [span_24](start_span)})[span_24](end_span)
      [span_25](start_span).catch((error) => {[span_25](end_span)
        [span_26](start_span)document.getElementById("error").innerText = error.code;[span_26](end_span)
      [span_27](start_span)});[span_27](end_span)
  [span_28](start_span)});[span_28](end_span)
[span_29](start_span)}

/* AUTH STATE LISTENER */
onAuthStateChanged(auth, (user) => {[span_29](end_span)
  [span_30](start_span)const currentPage = window.location.pathname.split("/").pop();[span_30](end_span)

  [span_31](start_span)if (!user && currentPage === "dashboard.html") {[span_31](end_span)
    [span_32](start_span)window.location.replace("index.html");[span_32](end_span)
  }

  [span_33](start_span)if (user && currentPage === "index.html") {[span_33](end_span)
    [span_34](start_span)window.location.replace("dashboard.html");[span_34](end_span)
  }
[span_35](start_span)});[span_35](end_span)

/* LOGOUT LOGIC */
[span_36](start_span)const logoutBtn = document.getElementById("logoutBtn");[span_36](end_span)
[span_37](start_span)if (logoutBtn) {[span_37](end_span)
  [span_38](start_span)logoutBtn.addEventListener("click", () => {[span_38](end_span)
    [span_39](start_span)signOut(auth).then(() => {[span_39](end_span)
      [span_40](start_span)window.location.replace("index.html");[span_40](end_span)
    [span_41](start_span)});[span_41](end_span)
  [span_42](start_span)});[span_42](end_span)
[span_43](start_span)}

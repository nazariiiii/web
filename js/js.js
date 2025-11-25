const link = document.getElementById("link");
const imgbtn = document.getElementById("imgbtn");

let theme = localStorage.getItem("theme");

if (!theme) {
    theme = "night";
    localStorage.setItem("theme", "night");
}

let islight = theme === "light";

function applyTheme() {
    if (islight) {
        link.href = "/css/lightmode.css";
        imgbtn.src = "/photos/night.png";
    } else {
        link.href = "/css/darkmode.css";
        imgbtn.src = "/photos/day.png";
    }
}

applyTheme();

imgbtn.addEventListener("click", function() {
    islight = !islight;

    if (islight) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "night");
    }

    applyTheme();
});
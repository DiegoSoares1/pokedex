const buttonAlterTheme = document.getElementById("button-alter-theme");
const body = document.querySelector("body");
const imageButtonAlterTheme = document.querySelector(".button-image");

buttonAlterTheme.addEventListener("click", () => {
    const darkModeIsActive = body.classList.contains("dark-mode");
    body.classList.toggle("dark-mode")
    if (darkModeIsActive) {
        imageButtonAlterTheme.setAttribute("src", "./imagens/sun.png")
    }else{
        imageButtonAlterTheme.setAttribute("src", "./imagens/moon.png")
    }
});
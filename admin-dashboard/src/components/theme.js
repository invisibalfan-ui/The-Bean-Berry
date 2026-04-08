export function setTheme(mode) {
  if (mode === "light") {
    document.documentElement.classList.add("light")
  } else {
    document.documentElement.classList.remove("light")
  }
}

export function setAccent(color) {
  document.documentElement.style.setProperty("--accent", color)
}
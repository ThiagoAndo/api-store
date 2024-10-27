// <!-- Mode -->
export function mode() {
  document.querySelectorAll(".mode").forEach((btn) => {
    let which = btn.textContent.trim();
    btn.addEventListener("click", () => {
      const html = document.querySelector("html");
      if (html.getAttribute("data-bs-theme") != which) {
        which = which[0].toLowerCase() + which.slice(1, which.length);
        document.querySelector("html").setAttribute("data-bs-theme", which);
        titleMode();
      }
    });
  });
}
function titleMode() {
  document.querySelectorAll(".title").forEach((t) => {
    const style = t.getAttribute("class");
    if (style.includes("text-white")) {
      t.classList.remove("text-white");
      t.classList.add("text-dark");
    } else {
      t.classList.remove("text-dark");
      t.classList.add("text-white");
    }
  });
}

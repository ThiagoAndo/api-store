const myModal = new bootstrap.Modal(document.getElementById("myModal"));
// <!-- Modal -->
document.querySelectorAll("#close").forEach((btn) => {
  btn.addEventListener("click", () => {
    myModal.hide();
    const token = localStorage.getItem("token");
    if (!token) {
      location.reload();
    }
  });
});
export function modal(call) {
  const id = localStorage.getItem("id");
  const email = localStorage.getItem("email");
  const title = document.querySelector(".modal-title");
  let content = null;
  if (call === "user") {
    title.textContent = "Last retrived user";
    content = `EMAIL: <span class="text-primary">  ${email}</span> <br/> <br/> ID:<span class="text-primary"> ${id}</span> `;
  }
  if (call === "purchase") {
    title.classList.add("text-danger");
    title.textContent = "Unable to perform action";
    content = `<h3>There is no </h3>`;
  }
  document.querySelector(".modal-body").innerHTML = content;
  document.querySelector(".modal-footer").innerHTML = `<span></span>`;
  myModal.show();
}

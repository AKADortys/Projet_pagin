function loadListeners() {
  const name = document.getElementById("nom");
  const lastname = document.getElementById("prenom");
  const btn = document.getElementById("btnadd");
  btn.addEventListener("click", () => {
    db.addUser({ firstname: name.value, lastname: lastname.value });
    name.value = "";
    lastname.value = "";
    return;
  });
}

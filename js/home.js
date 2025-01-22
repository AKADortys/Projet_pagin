async function initModule() {
  displayusers();

  const name = document.getElementById("nom");
  const lastname = document.getElementById("prenom");
  const btn = document.getElementById("btnadd");

  btn.addEventListener("click", async () => {
    if (name.value === "" || lastname.value === "") {
      alert("Veuillez renseigner tous les champs");
      return;
    }

    if (app.editMode) {
      // Mode modification
      await db.updateUser({
        id: app.currentUserId,
        firstname: name.value.trim(),
        lastname: lastname.value.trim(),
      });

      alert("Utilisateur modifié avec succès !");
      app.editMode = false;
      app.currentUserId = null;
      btn.textContent = "Ajouter";
    } else {
      // Mode ajout
      const exist = await db.exist(name.value.trim(), lastname.value.trim());
      if (exist) {
        alert("Cet utilisateur existe déjà");
        return;
      }

      await db.addUser({
        firstname: name.value.trim(),
        lastname: lastname.value.trim(),
      });
      alert("Utilisateur ajouté avec succès !");
    }

    name.value = "";
    lastname.value = "";
    displayusers();
  });
}

async function displayusers() {
  const userscontainer = document.getElementById("users");
  userscontainer.innerHTML = "";
  const users = await db.getUsers();

  let innerHTML =
    "<table class='table'><th>Identifiant</th><th>Nom</th><th>Prénom</th><th>Actions</th>";
  users.forEach((user) => {
    innerHTML += `<tr>
      <td>${user.id}</td>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>
        <button onclick='editUser(${user.id})'>Modifier</button>
        <button onclick='deleteUser(${user.id})'>Supprimer</button>
      </td>
      </tr>`;
  });

  userscontainer.innerHTML = innerHTML + "</table>";
}

async function editUser(userId) {
  const user = await db.getUserById(userId);

  if (user) {
    // Remplit les champs avec les informations de l'utilisateur
    document.getElementById("nom").value = user.firstname;
    document.getElementById("prenom").value = user.lastname;

    // Modifie l'état pour passer en mode édition
    const btn = document.getElementById("btnadd");
    btn.textContent = "Modifier";
    app.editMode = true;
    app.currentUserId = userId;
  }
}

async function deleteUser(userId) {
  await db.deleteUser(userId);
  alert("Utilisateur supprimé !");
  displayusers();
}

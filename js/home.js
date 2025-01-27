async function initModule() {
  displayusers();

  const name = document.getElementById("nom");
  const lastname = document.getElementById("prenom");
  const btn = document.getElementById("btnadd");

  document
    .getElementById("selectUsers-Del")
    .addEventListener("click", async () => {
      console.log("selectUsers", app.selectedUsers);
      app.selectedUsers.forEach(
        async (element) => await db.deleteUser(parseInt(element))
      );
      alert("Utilisateurs supprimés avec succès!");
      app.selectedUsers = [];
      document.getElementById("selectUsers-Del").style.display = "none";
      displayusers();
    });

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
    "<table class='table table-light'><th>id</th><th>Name</th><th>Lastname</th><th>Actions</th>";
  users.forEach((user) => {
    innerHTML += `<tr>
      <td>${user.id}</td>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>
        <button class="btn btn-success" onclick='editUser(${user.id})'>Modifier</button>
        <button class="btn btn-danger" onclick='deleteUser(${user.id})'>Supprimer</button>
        <input type="checkbox" class="selectedUser" data-selected="${user.id}">
      </td>
      </tr>`;
  });
  userscontainer.innerHTML = innerHTML + "</table>";
  document.querySelectorAll(".selectedUser").forEach((element) => {
    element.addEventListener("click", () => {
      const id = element.getAttribute("data-selected");
      element.checked
        ? app.selectedUsers.push(id)
        : app.selectedUsers.splice(app.selectedUsers.indexOf(id), 1);

      app.selectedUsers.length > 0
        ? (document.getElementById("selectUsers-Del").style.display = "block")
        : (document.getElementById("selectUsers-Del").style.display = "none");
    });
  });
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

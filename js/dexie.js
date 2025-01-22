const db = {
  instance: new Dexie("routing"),
};

db.init = () => {
  db.instance.version(1).stores({
    users: `++id, firstname, lastname`,
    address: `userId, street, number, zipcode, city, country`,
  });
};

db.addUser = (user) => {
  return db.instance.users.add(user);
};

db.getUserById = (id) => {
  return db.instance.users.get(id);
};
db.exist = (firstname, lastname) => {
  return db.instance.users
    .where("firstname")
    .equals(firstname)
    .and((user) => user.lastname === lastname)
    .count();
};

db.getUsers = () => {
  return db.instance.users.toArray().then((users) => {
    return users;
  });
};

db.deleteUser = (id) => {
  db.instance.users.delete(id);
};

db.updateUser = (user) => {
  db.instance.users.update(user.id, user);
};

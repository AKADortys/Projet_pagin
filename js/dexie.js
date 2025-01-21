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

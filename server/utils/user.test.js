const expect = require("expect");

const { Users } = require("./user");

describe("Users", () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "Mike",
        room: "The office fans",
      },
      {
        id: "2",
        name: "Shweta",
        room: "Designated survior",
      },
      {
        id: "3",
        name: "Mithun",
        room: "The office fans",
      },
    ];
  });

  it("should add new user", () => {
    let users = new Users();
    let user = {
      id: "sdddds",
      name: "WDJ",
      room: "The office fans",
    };
    let reUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it("should return names for the office fans", () => {
    let userList = users.getUserList("The office fans");
    expect(userList).toEqual(["Mike", "Mithun"]);
  });
  it("should return names for the Designated Survior", () => {
    let userList = users.getUserList("Designated survior");
    expect(userList).toEqual(["Shweta"]);
  });
  it("should find User", () => {
    let userId = "2",
      user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });
  it("should not find User", () => {
    let userId = "150",
      user = users.getUser(userId);

    expect(user).toBeUndefined();
  });

  it("should not remove a user", () => {
    let userId = "100",
      user = users.removeUser(userId);
    expect(user).toBeUndefined;
    expect(users.users.length).toBe(3);
  });

  it("should remove a user", () => {
    let userId = "1",
      user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });
});

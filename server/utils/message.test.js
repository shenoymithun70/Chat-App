let expect = require("expect");
var { generateMessage, generateLocationMessage } = require("./message");

describe("Generate Message", () => {
  it("should generate correct message object", () => {
    let from = "WDJ",
      text = "SOme random text",
      message = generateMessage(from, text);
    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({ from, text });
  });
});

describe("Generate location Message", () => {
  it("should generate correct location object", () => {
    let from = "Claire",
      lat = 15,
      lon = 56,
      url = `https://www.google.com/maps?q=${lat}, ${lon}`,
      message = generateLocationMessage(from, lat, lon);
    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({ from, url });
  });
});

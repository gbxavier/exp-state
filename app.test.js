const st = require("supertest");
const Redis = require("ioredis-mock");
const mockRedis = jest.fn(() => {
  return new Redis();
});

jest.mock("ioredis", () => mockRedis);

const app = require("./app");

describe("Test Counter Logic", () => {
  beforeEach(async () => {
    await mockRedis().set("visits", 0); // Reset counter
  });

  afterEach(async () => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it("should increment counter", async () => {
    const rIncr = await st(app).get("/");
    expect(rIncr.statusCode).toBe(200);
    expect(rIncr.text).toContain("Counter:");
    expect(rIncr.text).toContain('id="counter">1'); // Should contain the mocked value
  });

  it("should nuke counter", async () => {
    await mockRedis().set("visits", 4); // Set initial state

    const rNuke = await st(app).post("/nuke");
    expect(rNuke.statusCode).toBe(200);
    expect(rNuke.body).toEqual({ status: "completed" });

    const rCheck = await st(app).get("/");
    expect(rCheck.statusCode).toBe(200);
    expect(rCheck.text).toContain('id="counter">1');
  });
});

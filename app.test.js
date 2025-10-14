const st = require("supertest");
const Redis = require("ioredis-mock");
const mockRedis = jest.fn(() => {
  return new Redis();
});

jest.mock("ioredis", () => mockRedis);

const app = require("./app");

describe("Test Counter Logic", () => {
  afterEach(async () => {
    await st(app).post("/nuke"); // TODO: Improve flush logic
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it("should increment counter", async () => {
    const response = await st(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Counter:");
    expect(response.text).toContain('id="counter">1'); // Should contain the mocked counter value
  });

  it("should nuke counter", async () => {
    const response1 = await st(app).get("/");
    expect(response1.statusCode).toBe(200);
    expect(response1.text).toContain('id="counter">1');

    const response2 = await st(app).get("/");
    expect(response2.statusCode).toBe(200);
    expect(response2.text).toContain('id="counter">2');

    const response3 = await st(app).get("/");
    expect(response3.statusCode).toBe(200);
    expect(response3.text).toContain('id="counter">3');

    const response4 = await st(app).post("/nuke");
    expect(response4.statusCode).toBe(200);
    expect(response4.body).toEqual({ status: "completed" });

    const response = await st(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('id="counter">1');
  });
});

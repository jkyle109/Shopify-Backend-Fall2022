const request = require("supertest");
const mockingoose = require("mockingoose");
const app = require("../app.js");
const Items = require("../models/itemModel.js");
const bson = require("bson");

describe("GET /items", () => {
  test("should return 200", async () => {
    const doc = [];
    mockingoose(Items).toReturn(doc, "find");
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([]);
    expect(res.body.length).toBe(0);
  });
  test("should return 404 if null", async () => {
    const doc = null;
    mockingoose(Items).toReturn(doc, "find");
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(404);
  });
  test("should return 400 if error", async () => {
    const doc = Error();
    mockingoose(Items).toReturn(doc, "find");
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /items/:id", () => {
  test("should return 200 if valid id", async () => {
    const doc = {
      _id: new bson.ObjectId(),
      name: "Item1",
      amount: 1,
      lastUpdated: Date.now,
      deleted: false,
    };
    mockingoose(Items).toReturn(doc, "findOne");
    const res = await request(app).get(`/items/${doc._id}`);
    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body._id)).toStrictEqual(JSON.stringify(doc._id));
  });
  test("should return 404 if null", async () => {
    const doc = null;
    const id = new bson.ObjectId();
    mockingoose(Items).toReturn(doc, "findOne");
    const res = await request(app).get(`/items/${id}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toContain(id.toString());
  });
  test("should return 404 if not 12-bit hex", async () => {
    const doc = {
      _id: 1,
      name: "Item1",
      amount: 1,
      lastUpdated: Date.now,
      deleted: false,
    };
    mockingoose(Items).toReturn(doc, "findOne");
    const res = await request(app).get(`/items/${doc._id}`);
    expect(res.statusCode).toBe(404);
  });
  test("should return 400 if not 12-bit hex", async () => {
    const doc = Error();
    mockingoose(Items).toReturn(doc, "findOne");
    const res = await request(app).get(`/items/${new bson.ObjectId()}`);
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /items/deleted", () => {
  test("should return 200", async () => {
    const doc = [];
    mockingoose(Items).toReturn(doc, "find");
    const res = await request(app).get("/items/deleted");
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([]);
    expect(res.body.length).toBe(0);
  });
});

describe("POST /items", () => {
  test("should return 201 when added.", async () => {
    const doc = {
      name: "Item1",
    };
    const res = await request(app).post("/items").send(doc);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(doc.name);
  });
});

describe("PATCH /items/:id", () => {
  test("should return 200 when updated.", async () => {
    const doc1 = { _id: new bson.ObjectId(), name: "Item1" };
    const doc2 = { _id: new bson.ObjectId(), name: "Item2" };
    mockingoose(Items).toReturn(doc1, "findOne");
    const res = await request(app).patch(`/items/${doc1._id}`).send(doc2);
    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body._id)).toStrictEqual(
      JSON.stringify(doc2._id)
    );
  });
});

describe("DELETE /items/:id", () => {
  test("should return 200 when archived.", async () => {
    const doc = {
      _id: new bson.ObjectId(),
      name: "McDonald's Tenders",
      deleted: false,
      deleteComment: "I don't think we sell these anymore.",
    };
    mockingoose(Items).toReturn(doc, "findOne");
    const res = await request(app)
      .delete(`/items/${doc._id}`)
      .send(doc)
      .catch((err) => console.log(err));
    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body._id)).toStrictEqual(JSON.stringify(doc._id));
  });
  test("should return 200 when deleted.", async () => {
    const doc = {
      _id: new bson.ObjectId(),
      name: "McDonald's Tenders",
      deleted: true,
      deleteComment: "I don't think we sell these anymore.",
    };
    mockingoose(Items).toReturn(doc, "findOne");
    mockingoose(Items).toReturn(doc, "findOneAndDelete");
    const res = await request(app)
      .delete(`/items/${doc._id}`)
      .send(doc)
      .catch((err) => console.log(err));
    console.log(res.body, doc._id);
    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body._id)).toStrictEqual(JSON.stringify(doc._id));
  });
});

const request = require("supertest");
const mockingoose = require("mockingoose");
const app = require("../app.js");
const Items = require("../models/itemModel.js");
const { status } = require("express/lib/response");
const { ObjectId } = require("mongoose").Types;

describe("Get /items", () => {
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
    const doc = new Error();
    mockingoose(Items).toReturn(doc, "find");
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(400);
  });
});

describe("Get /items/:id", () => {
  test("should return 200 if valid id", async () => {
    const doc = {
      _id: new ObjectId(),
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
    const id = ObjectId();
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
    const doc = new Error();
    mockingoose(Items).toReturn(doc, "findOne");
    const res = await request(app).get(`/items/${ObjectId()}`);
    expect(res.statusCode).toBe(400);
  });
});

describe("Get /items/deleted", () => {
  test("should return 200", async () => {
    const doc = [];
    mockingoose(Items).toReturn(doc, "find");
    const res = await request(app).get("/items/deleted");
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([]);
    expect(res.body.length).toBe(0);
  });
});

// beforeEach(() => {
//   mockingoose.resetAll();
// });

// describe("Get /items", () => {
//   test("when no items should return empty list.", async () => {
//     const doc = [];
//     mockingoose(Items).toReturn(doc, "find");
//     const res = await request(app).get("/items");
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toStrictEqual([]);
//   });

//   test("when there are items, return all items.", async () => {
//     const doc = [
//       {
//         _id: new ObjectId(),
//         name: "Item1",
//         amount: 1,
//         lastUpdated: Date.now,
//         deleted: false,
//       },
//       {
//         _id: new ObjectId(),
//         name: "Item2",
//         amount: 2,
//         lastUpdated: Date.now,
//         deleted: false,
//       },
//       {
//         _id: new ObjectId(),
//         name: "Item3",
//         amount: 3,
//         lastUpdated: Date.now,
//         deleted: false,
//       },
//     ];
//     mockingoose(Items).toReturn(doc, "find");
//     const res = await request(app).get("/items");
//     console.log(res.body);
//     expect(res.body.length).toBe(3);
//   });
//   test("when there are deleted items, return all deleted items.", async () => {
//     const doc = [
//       {
//         _id: new ObjectId(),
//         name: "Item4",
//         amount: 4,
//         lastUpdated: Date.now,
//         deleted: true,
//         deleteComment: "4",
//       },
//       {
//         _id: new ObjectId(),
//         name: "Item5",
//         amount: 5,
//         lastUpdated: Date.now,
//         deleted: true,
//         deleteComment: "5",
//       },
//       {
//         _id: new ObjectId(),
//         name: "Item6",
//         amount: 6,
//         lastUpdated: Date.now,
//         deleted: true,
//         deleteComment: "6",
//       },
//     ];
//     mockingoose(Items).toReturn(doc, "find");
//     const res = await request(app).get("/items");
//     console.log(res.body);
//     expect(res.body.length).toBe(3);
//   });
// });

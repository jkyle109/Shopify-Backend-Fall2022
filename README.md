# Shopify-Backend-Fall2022

---

## Setup

Head over to postman and query using the Replit URL: https://Shopify-Backend-Fall2022.jkyle109.repl.co

## Technologies

- Express
- MongoDB
- Jest

## Demo

![Demo image](/demo/example_query.png)

## Endpoints

- GET
  - /items/
    - Returns all items (not deleted)
  - /items/:id
    - Return specific item (both deleted and not deleted)
  - /items/deleted
    - Returns all archived items
- POST
  - /items/
    - Creates new item
- PUT
  - /items/:id
    - Updates a specific item, overwriting the entire entry
- PATCH
  - /items/restore/:id
    - Restores an item
  - /items/:id
    - Updates a specific item, keeping unspecified states the same
- DELETE
  - /items/:id
    - First attempt archives item while second completely removes the entry.

## Additions feature

This implementation allows for items records to first be archived when first attempted to be deleted. This is done by setting the deleted flag to true in the database entry.

These documents are then set to be fully removed automatically by mongoDB after a set time (Time To Live: one day) or by confirming the removal buy sending an addition delete request.

Items can be restored by setting the deleted flag to false which in turn clears the TTL.

## Inventory Item Schema

- \_id:
  - type: ObjectId
  - required: true
  - default: new bson.ObjectId()
- name:
  - type: String
  - required: false
- amount:
  - type: Number,
  - required: false,
  - default: 0
- price:
  - type: Number
  - required: false
  - default: 0.0
- description:
  - type: String
  - required: false
  - default: "N/A"
- lastUpdated:
  - type: Date
  - required: false
  - default: current date
- deleted:
  - type: Boolean
  - required: false
  - default: false
- deleteComment:
  - type: String
  - required: false

## What's next

- Implement better error handling
- Better duplicate checking to allow item ids to be changed
- Frontend interface to allow users to perform requests in house.
- More schema restrictions to better fit the inventory systems's requirements. (eg. negative stock could be intentional symbolise item backorder)
- Querying for specific items

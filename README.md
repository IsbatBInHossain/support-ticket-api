# Support Ticket API

## Overview

This repository contains the code for a simple API that allows users to create support tickets. The API is built using Node.js with Express and MongoDB for data storage.

### API Endpoint

#### Create Support Ticket

- Endpoint: /support/create_ticket
- Method: POST
- Content-type: JSON
- Payload:
  ```
  {
    "userID": "<String>",
    "date": "<DateTime>",
    "deviceID": "<String>",
    "queryText": "<String>"
  }
  ```

### Response Cases

#### Case 1: Ticket Creation Successful

- Response Code: 200
- Response Data:
  ```
  {
    "data": {
      "_id": "<mongodb_id_for_the_document>"
    }
  }
  ```

#### Case 2: Ticket Creation Conflict

- Response Code: 409
- Response Data:
  ```
  {
    "message": "You have already placed a support ticket. Please wait at least one hour before sending another request"
  }
  ```

## Implementation Details

The API checks the time difference between the last support ticket and the current request. Depending on whether the last request was more than 30 minutes ago, it either saves the new ticket in the database or returns a conflict response.

### Dependencies

- Node.js
- Express
- MongoDB
- Mongoose

## How to Run

- Clone the repository.
- Install dependencies using `npm install`.
- Set up a MongoDB database and update the `MONGODB_URI` in the `.env` file.
- Run the application with `npm start`.

The server will be running on http://localhost:3000 by default.
You can make a POST request to live website in this url: https://dune-cooked-hoverfly.glitch.me/support/create_ticket

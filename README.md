
#  Quiz Backend

  

A real-time quiz backend built with NestJS, MongoDB, and WebSockets where two players compete against each other.

  

##  Features

  

- User authentication with JWT

- Real-time game matching and gameplay via WebSockets

- Question management with pre-stored questions

- Score tracking and winner determination

  

##  Tech Stack

  

-  **Backend**: NestJS

-  **Database**: MongoDB

-  **Real-Time Communication**: WebSockets (Socket.IO)

-  **Authentication**: JWT (JSON Web Tokens)

  

##  Prerequisites

  

- Node.js (v18 or higher)

- MongoDB (running locally or connection string)

- npm or yarn

  

##  Installation

  

1. Install dependencies:

```bash

npm  install

```

  

2. Set up environment variables (optional, defaults provided):

```bash

# Create .env file

MONGODB_URI=your-mongo-db-uri

JWT_SECRET=your-secret-key-change-in-production

PORT=80

```


3. Start the development server:

```bash

npm  run  start:dev

```

  

The server will start on `http://localhost:80`

  

##  API Endpoints

  

###  Authentication

  

####  POST /register

Register a new user.

  

**Request Body:**

```json

{

"username": "player1",

"email": "player1@example.com",

"password": "password123"

}

```

  

**Response:**

```json

{

"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

"user": {

"id": "user_id",

"username": "player1",

"email": "player1@example.com"

}

}

```

  

####  POST /login

Authenticate a user and receive a JWT token.

  

**Request Body:**

```json

{

"email": "player1@example.com",

"password": "password123"

}

```

  
  

###  Game

  

####  POST /game/start

Initiates game matchmaking. Returns instructions for WebSocket connection.

  

**Headers:**

```

Authorization: Bearer <access_token>

```

  

####  GET /game/history

Get game history for the authenticated user.

  

**Headers:**

```

Authorization: Bearer <access_token>

```  

##  WebSocket Events

  

###  Connection

  

Connect to WebSocket at `ws://localhost:80/game`

  

**Authentication:**

Include JWT token in connection:

```javascript

// Option 1: In auth object

socket.io.opts.auth  = { token: 'your_jwt_token' };

  

// Option 2: In Authorization header

socket.io.opts.extraHeaders  = {

Authorization: 'Bearer your_jwt_token'

};

```

  

###  Client → Server Events

  

####  `game:int`

Start matchmaking for a new game. When two players are matched, the game begins.
  

**Response Events:**

-  `game:waiting` - No opponent found yet, waiting in queue

-  `game:init` - Game initialized (match found)

-  `game:error` - Error occurred

  

####  `question:ready`

Signal that player is ready for the next question.

 

**Response Events:**

-  `answer:result` - Answer feedback

-  `question:send` - Next question (if not last)

-  `game:end` - Game completed (if last question)

-  `game:error` - Error occurred

  

###  Server → Client Events

  

####  `game:waiting`

Player is waiting for an opponent.


####  `game:joined`

Game has been initialized with both players matched.
  

####  `question:sent`

A question is being sent to the player.
  

####  `answer:result`

Feedback on submitted answer.

  

####  `game:end`

Game has completed. Final results.


####  `game:error`

An error occurred during game operations.

  

##  Game Flow

  

1.  **User Registration/Login**: User registers or logs in to get a JWT token

2.  **WebSocket Connection**: User connects to WebSocket with JWT token

3.  **Game Start**: User emits `game:start` event

4.  **Matchmaking**: Server matches two players

5.  **Game Init**: Both players receive `game:init` event

6.  **Question Delivery**: Questions are sent via `question:send` event

7.  **Answer Submission**: Players submit answers via `answer:submit` event

8.  **Results**: After 6 questions, `game:end` event is sent with final scores

9.  **Winner Determination**: Player with highest score wins (or tie if equal)

  

##  Notes

  

- Passwords are hashed using bcrypt before storage

- JWT tokens expire after 24 hours

- Game sessions are stored in MongoDB for history tracking

- WebSocket connections require JWT authentication

- Each game consists of exactly 6 questions
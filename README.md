# NodeJS bokningsplattform projektarbete
Detta är en backend applikation för en Coworking Space. Plattformen kan låta användare registrera sig, logga in, och boka arbetsplatser eller konferensrum. En admin kan logga in och hantera användare, rum och bokningar 

## Teknik
- Node.js & Express
- MongoDB & Mongoose
- JWT & bcrypt
- Redis- caching för optimalisering
- Winston & Morgan för loggning

## Installation och Setup
- Node.js (v18 eller högre)
- MongoDB
- Redis (Memurai för windows)

## Steg för att köra projektet
1. Klona repo
    git clone
    cd nodejs-bokningsplattform-projekt

2. Installera dependencies
    npm install

3. Skapa .env fil
    Skapa .env fil i root-map:

    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/coworking-booking
    JWT_SECRET=din_hemliga_nyckel_här
    NODE_ENV=development

4. Starta MongoDB

5. Starta Redis

6. Starta Servern
    npm start

Servern körs nu på http://localhost:5000


## API-dokumentation

### Autentisering

#### Registrera användare
- **POST** `/auth/register`
- **Autentisering:** Ingen

**Body:**
```json
{
  "username": "username",
  "password": "password123",
  "role": "User"
}
```

**Response:**
```json
{
  "message": "Användare skapad",
  "userId": "69a5b54b6502bfa95fabceae"
}
```

---

#### Logga in
- **POST** `/auth/login`
- **Autentisering:** Ingen

**Body:**
```json
{
  "username": "username",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Inloggad",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "69a5b54b6502bfa95fabceae",
    "username": "username",
    "role": "User"
  }
}
```

---

#### Hämta profil
- **GET** `/auth/me`
- **Autentisering:** Token krävs
- **Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Du är inloggad",
  "user": {
    "userId": "69a5b54b6502bfa95fabceae",
    "role": "User"
  }
}
```

---

#### Admin-only route
- **GET** `/auth/admin-only`
- **Autentisering:** Admin token krävs
- **Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "message": "Välkommen admin!",
  "user": {
    "userId": "69a5b54b6502bfa95fabceae",
    "role": "Admin"
  }
}
```

---

#### Hämta alla användare
- **GET** `/auth/users`
- **Autentisering:** Ingen (i testläge - bör vara admin)

**Response:**
```json
{
  "users": [
    {
      "_id": "69a5b54b6502bfa95fabceae",
      "username": "username",
      "role": "User"
    }
  ]
}
```

---

#### Ta bort användare
- **DELETE** `/auth/users/:id`
- **Autentisering:** Ingen (i testläge - bör vara admin)

**Response:**
```json
{
  "message": "Användare raderat",
  "user": {
    "_id": "69a5b54b6502bfa95fabceae",
    "username": "username"
  }
}
```

---

### Rum

#### Hämta alla rum
- **GET** `/rooms`
- **Autentisering:** Token krävs
- **Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "rooms": [
    {
      "_id": "69a5b6546502bfa95fabceb4",
      "name": "Stockholm",
      "capacity": 15,
      "type": "conference"
    }
  ]
}
```

---

#### Skapa rum
- **POST** `/rooms`
- **Autentisering:** Admin token krävs
- **Headers:** `Authorization: Bearer <admin-token>`

**Body:**
```json
{
  "name": "Göteborg",
  "capacity": 10,
  "type": "workspace"
}
```

**Response:**
```json
{
  "message": "Rum skapat",
  "room": {
    "_id": "69a5b6546502bfa95fabceb4",
    "name": "Göteborg",
    "capacity": 10,
    "type": "workspace"
  }
}
```

---

#### Uppdatera rum
- **PUT** `/rooms/:id`
- **Autentisering:** Admin token krävs
- **Headers:** `Authorization: Bearer <admin-token>`

**Body:**
```json
{
  "name": "Stockholm Uppdaterad",
  "capacity": 20,
  "type": "conference"
}
```

**Response:**
```json
{
  "message": "Rum uppdaterat",
  "room": {
    "_id": "69a5b6546502bfa95fabceb4",
    "name": "Stockholm Uppdaterad",
    "capacity": 20,
    "type": "conference"
  }
}
```

---

#### Ta bort rum
- **DELETE** `/rooms/:id`
- **Autentisering:** Admin token krävs
- **Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "message": "Rum raderat",
  "room": {
    "_id": "69a5b6546502bfa95fabceb4",
    "name": "Stockholm",
    "capacity": 15,
    "type": "conference"
  }
}
```

---

### Bokningar

#### Hämta alla bokningar (Admin)
- **GET** `/bookings`
- **Autentisering:** Admin token krävs
- **Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "bookings": [
    {
      "_id": "69a5bab66502bfa95fabcec3",
      "roomId": {
        "_id": "69a5b6546502bfa95fabceb4",
        "name": "Stockholm",
        "capacity": 15,
        "type": "conference"
      },
      "userId": {
        "_id": "69a5b54b6502bfa95fabceae",
        "username": "username"
      },
      "startTime": "2026-03-10T09:00:00.000Z",
      "endTime": "2026-03-10T11:00:00.000Z"
    }
  ]
}
```

---

#### Hämta mina bokningar
- **GET** `/bookings/my-bookings`
- **Autentisering:** Token krävs
- **Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "bookings": [
    {
      "_id": "69a5bab66502bfa95fabcec3",
      "roomId": {
        "_id": "69a5b6546502bfa95fabceb4",
        "name": "Stockholm",
        "capacity": 15,
        "type": "conference"
      },
      "userId": "69a5b54b6502bfa95fabceae",
      "startTime": "2026-03-10T09:00:00.000Z",
      "endTime": "2026-03-10T11:00:00.000Z"
    }
  ]
}
```

---

#### Skapa bokning
- **POST** `/bookings`
- **Autentisering:** Token krävs
- **Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "roomId": "69a5b6546502bfa95fabceb4",
  "startTime": "2026-03-10T09:00:00Z",
  "endTime": "2026-03-10T11:00:00Z"
}
```

**Response:**
```json
{
  "message": "Bokning skapad",
  "booking": {
    "_id": "69a5bab66502bfa95fabcec3",
    "roomId": "69a5b6546502bfa95fabceb4",
    "userId": "69a5b54b6502bfa95fabceae",
    "startTime": "2026-03-10T09:00:00.000Z",
    "endTime": "2026-03-10T11:00:00.000Z"
  }
}
```

---

#### Uppdatera bokning
- **PUT** `/bookings/:id`
- **Autentisering:** Token krävs (egen bokning eller admin)
- **Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "startTime": "2026-03-10T14:00:00Z",
  "endTime": "2026-03-10T16:00:00Z"
}
```

**Response:**
```json
{
  "message": "Bokning Uppdaterad",
  "booking": {
    "_id": "69a5bab66502bfa95fabcec3",
    "roomId": "69a5b6546502bfa95fabceb4",
    "userId": "69a5b54b6502bfa95fabceae",
    "startTime": "2026-03-10T14:00:00.000Z",
    "endTime": "2026-03-10T16:00:00.000Z"
  }
}
```

---

#### Ta bort bokning
- **DELETE** `/bookings/:id`
- **Autentisering:** Token krävs (egen bokning eller admin)
- **Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Bokning raderat",
  "booking": {
    "_id": "69a5bab66502bfa95fabcec3",
    "roomId": "69a5b6546502bfa95fabceb4",
    "userId": "69a5b54b6502bfa95fabceae"
  }
}
```
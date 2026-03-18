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

### Registrera användare:
POST /auth/register
Autentisering: Ingen

Body:
{
    "username": "*username*",
    "password": "*password*"
    "role": "User || Admin"
}

Response:
json
{
    "message": "Användare skapad",
    "userId": "..."
}

### Logga in
POST /auth/login
Autentisering: Ingen

Body:
{
    "username": "*username*",
    "password": "*password*"
}

Response: 
{
    "message": "Inloggad",
    "token": "eyJhbGc...",
    "user": {
      "id": "...",
      "username": "*username*",
      "role": "User || Admin"
    }
}

### Hämta profil
GET /auth/me
Autentisering: Token
Headers: Authorization: Bearer *token*

### Admin
GET /auth/admin-only
Autentisering: Admin token
Headers: Authorization: Bearer *token*

Response:
{
    "message": "Välkommen admin!",
    "user": {
      "userId": "...",
      "role": "Admin"
    }
}

### Hämta alla användare
GET /auth/users
Autentisering: Ingen nu i testläget

Response:
{
    "users": [
      {
        "_id": "...",
        "username": "*username*",
        "role": "User || Admin"
      }
    ]
}

### Ta Bort användare
DELETE /auth/users/:id
Autentisering: Ingen i nuläget men ska vara admin token

Response:
{
    "message": "Användare raderat",
    "user": {
      "_id": "...",
      "username": "*username*"
    }
}
### Skapa rum
POST /rooms
Autentisering: Admin token
Headers: Authorization: Bearer *admin-token*

body:
{
    "name": "*room name*",
    "capacity": ..,
    "type": "conference || workspace"
}

response:
{
    "message": "Rum skapat",
    "room": {
        "_id": "...",
        "name": "*room name*",
        "capacity": ..,
        "type": "conference || workspace"
    }
}

### Hämta alla rum
GET /rooms
Autentisering: Token
Headers: Authorization: Bearer *token*

Response: 
{
    "rooms": [
      {
        "_id": "...",
        "name": "*room name*",
        "capacity": ..,
        "type": "conference || workspace"
      }
    ]
}

### Uppdatera rum
PUT /rooms/:id
Autentisering: Admin token
Headers: Authorization: Bearer *admin-token*

Body:
{
    "name": "*room name* Uppdaterad",
    "capacity": ..,
    "type": "conference || workspace"
}

Response: 
{
    "message": "Rum uppdaterat",
    "room": {
      "_id": "...",
      "name": "*room name* Uppdaterad",
      "capacity": ..,
      "type": "conference || workspace"
    }
}


### Ta bort rum
DELETE /rooms/:id
Autentisering: Admin token
Headers: Authorization: Bearer *admin-token*

Response:
{
    "message": "Rum raderat",
    "room": {
      "_id": "...",
      "name": "*room name*",
      "capacity": ..,
      "type": "conference || workspace"
    }
}

### Hämta alla bokningar
GET /bookings
Autentisering: Admin token
Headers: Authorization: Bearer *admin-token*

response:
{
    "bookings": [
      {
        "_id": "...",
        "roomId": {
          "name": "*room name*",
          "capacity": ..,
          "type": "conference || workspace"
        },
        "userId": {
          "username": "*username*"
        },
        "startTime": "2026-03-10T09:00:00.000Z",
        "endTime": "2026-03-10T11:00:00.000Z"
      }
    ]
  }

### Hämta mina bokningar
GET /bookings/my-bookings
Autentisering: Token
Headers: Authorization: Bearer *token*

response: 
{
    "bookings": [
      {
        "_id": "...",
        "roomId": {
          "name": "*room name*"
        },
        "startTime": "2026-03-10T09:00:00.000Z",
        "endTime": "2026-03-10T11:00:00.000Z"
      }
    ]
  }

### Skapa Bokning
POST /bookings
Autentisering: Token
Headers: Authorization: Bearer *token*

body:
{
    "roomId": "...",
    "startTime": "2026-03-10T09:00:00Z",
    "endTime": "2026-03-10T11:00:00Z"
}

response:
{
    "message": "Bokning skapad",
    "booking": {
      "_id": "...",
      "roomId": "...",
      "userId": "...",
      "startTime": "2026-03-10T09:00:00.000Z",
      "endTime": "2026-03-10T11:00:00.000Z"
    }
}

### Uppdatera Bokning
PUT /bookings/:id
Autentisering: User token för egen bokning, Admin token för alla bokningar
Headers: Authorization: Bearer *token*

body:
{
    "startTime": "2026-03-10T14:00:00Z",
    "endTime": "2026-03-10T16:00:00Z"
}

response: 
{
    "message": "Bokning Uppdaterad",
    "booking": {
      "_id": "...",
      "startTime": "2026-03-10T14:00:00.000Z",
      "endTime": "2026-03-10T16:00:00.000Z"
    }
}


### Ta bort bokning
DELETE /bookings/:id
Autentisering: User token för egen bokning, Admin token för alla bokningar
Headers: Authorization: Bearer *token*

response:
{
    "message": "Bokning raderat",
    "booking": {
      "_id": "...",
      "roomId": "...",
      "userId": "..."
    }
  }
# Game-EX API Spec

## Register User

Endpoint : POST /auth/register

Headers :
- Content-Type: application/json
x
Request Body :

```json

{
  "username": "HuanAnderson",
  "email": "huan@google.com",
  "password": "pass123"
}
```

Response Body Success :

```json
{
 {
  "userId": 6
}
}
```

Response Body Error :

```json
{
   "msg": "data and salt arguments required"
}
```

## Login User

Endpoint : POST /auth/login

Headers :
- Content-Type: application/json

Request Body :

```json
{
  "email": "huan@google.com",
  "password": "pass123"
}
```

Response Body Success :

```json
{
  "accessToken": "*****",
  "refreshToken": "****"
}
```

Response Body Error :

```json
{
  "msg": "Invalid password"
}
```

## Logout User

Endpoint : POST /auth/logout

Headers :
- Content-Type: application/json

Response Body  :

```json
{
  "token": "*refrest token*",
}
```

Response Body Success :

```json
{
  "msg" : "OK"
}
```

## Refresh Token User

Endpoint : POST /auth/refresh

Headers :
- Content-Type: application/json

Response Body  :

```json
{
  "token": "*refrest token*",
}
```

Response Body Success :

```json
{
  "msg" : "OK"
}
```

## Game

### Get All Games

**Endpoint** : `GET /games`  
**Access** : Public  

**Response Body Success**:
```json
[
  {
    "id": 1,
    "nama": "Elden Ring",
    "gambar": "https://storage.googleapis.com/bucket-name/uuid_filename.jpg",
    "harga": 599000,
    "tag": "Action, RPG",
    "deskripsi": "Epic open world adventure",
    "User": {
      "id": 2,
      "username": "UploaderName",
      "email": "uploader@example.com"
    }
  }
]
```

### Get Game Detail

**Endpoint** : `GET /games/:id`  
**Access** : Public  

**Response Body Success**:
```json
{
  "id": 1,
  "nama": "Elden Ring",
  "gambar": "https://storage.googleapis.com/bucket-name/uuid_filename.jpg",
  "harga": 599000,
  "tag": "Action, RPG",
  "deskripsi": "Epic open world adventure",
  "User": {
    "id": 2,
    "username": "UploaderName",
    "email": "uploader@example.com"
  }
}
```

**Response Body Error**:
```json
{
  "msg": "Game not found"
}
```

### Create Game

**Endpoint** : `POST /games`  
**Access** : Protected (requires JWT token)  
**Headers**:
- `Content-Type: multipart/form-data`  
- `Authorization: Bearer <accessToken>`  

**Form Data**:
- `gambar`: *image file*
- `nama`: *string*
- `harga`: *number*
- `tag`: *string*
- `deskripsi`: *string*

**Response Body Success**:
```json
{
  "id": 10,
  "uploader_id": 1,
  "nama": "Hollow Knight",
  "gambar": "https://storage.googleapis.com/bucket-name/uuid_filename.jpg",
  "harga": 120000,
  "tag": "Metroidvania",
  "deskripsi": "A beautiful bug-filled world"
}
```

**Response Body Error**:
```json
{
  "msg": "No image uploaded"
}
```

### Update Game

**Endpoint** : `PUT /games/:id`  
**Access** : Protected (requires JWT token)  
**Headers**:
- `Content-Type: multipart/form-data`  
- `Authorization: Bearer <accessToken>`  

**Form Data** (optional `gambar` image file):
- `nama`: *string*
- `harga`: *number*
- `tag`: *string*
- `deskripsi`: *string*

**Response Body Success**:
```json
{
  "id": 10,
  "nama": "Hollow Knight Updated",
  "gambar": "https://storage.googleapis.com/bucket-name/uuid_newfilename.jpg",
  "harga": 100000,
  "tag": "Adventure",
  "deskripsi": "Updated description"
}
```

**Response Body Error**:
```json
{
  "msg": "Unauthorized"
}
```

### Apply Discount to Game

**Endpoint** : `PATCH /games/:id/discount`  
**Access** : Protected (requires JWT token)  
**Headers**:
- `Content-Type: application/json`  
- `Authorization: Bearer <accessToken>`  

**Request Body**:
```json
{
  "discount": 30
}
```

**Response Body Success**:
```json
{
  "id": 10,
  "discount": 30
}
```

**Response Body Error**:
```json
{
  "msg": "Unauthorized"
}
```

### Get Sales History for Game

**Endpoint** : `GET /games/:id/sales`  
**Access** : Protected (requires JWT token)  
**Headers**:
- `Authorization: Bearer <accessToken>`

**Response Body Success**:
```json
[
  {
    "id": 21,
    "id_game": 10,
    "id_user": 3,
    "createdAt": "2025-06-01T12:00:00.000Z",
    "updatedAt": "2025-06-01T12:00:00.000Z",
    "Game": {
      "id": 10,
      "nama": "Hollow Knight",
      "uploader_id": 1
    }
  }
]
```

### Delete Game

**Endpoint** : `DELETE /games/:id`  
**Access** : Protected (requires JWT token)  
**Headers**:
- `Authorization: Bearer <accessToken>`

**Response Body Success**:
```json
{
  "msg": "Game deleted successfully"
}
```

**Response Body Error**:
```json
{
  "msg": "Unauthorized"
}
```


## Register User

**Endpoint:** `POST /auth/register`  
**Headers:**  
- Content-Type: application/json

### Request Body:
```json
{
  "username": "HuanAnderson",
  "email": "huan@google.com",
  "password": "pass123"
}
```

### Response Body Success:
```json
{
  "status": "Success",
  "message": "User Registered",
  "userId": 6
}
```

### Response Body Error:
```json
{
  "status": "Error",
  "message": "Email already exists"
}
```

---

## Login User

**Endpoint:** `POST /auth/login`  
**Headers:**  
- Content-Type: application/json

### Request Body:
```json
{
  "email": "huan@google.com",
  "password": "pass123"
}
```

### Response Body Success:
```json
{
  "status": "Success",
  "message": "Login Berhasil",
  "safeUserData": {
    "id": 6,
    "username": "HuanAnderson",
    "email": "huan@google.com"
  },
  "accessToken": "*****"
}
```

### Response Body Error:
```json
{
  "status": "Error",
  "message": "Password atau email salah"
}
```

---

## Logout User

**Endpoint:** `POST /auth/logout`  
**Headers:**  
- Cookie: refreshToken

### Response Body Success:
HTTP Status 200 OK

### Response Body Error:
HTTP Status 204 No Content

---

## Refresh Token

**Endpoint:** `POST /auth/refresh`  
**Headers:**  
- Cookie: refreshToken

### Response Body Success:
```json
{
  "accessToken": "*****"
}
```

### Response Body Error:
HTTP Status 403 Forbidden

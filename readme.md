### INSTALL PACKAGES

> npm i express dotenv mysql2 jsonwebtoken bcrypt cors morgan

---

### Login to mysql

❯ mysql -u root -p

> Enter password here

### Create database

> CREATE DATABASE `db_name`;

### Connect to database

> USE `db_name`;

### Create users tables

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    gender enum('Male', 'Female') DEFAULT 'Male'  NOT NULL,
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
```

### Create grant table

```sql
CREATE TABLE IF NOT EXISTS grants (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    grant_name VARCHAR(255) NOT NULL,
    grant_type VARCHAR(255) NOT NULL,
    grant_amount VARCHAR(255) NOT NULL,
    grant_description VARCHAR(255) NOT NULL,
    grant_status enum('Pending', 'Approved', 'Rejected') DEFAULT 'Pending'  NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );
```

#### User Routes

Create a new user

> POST /api/users/register

```json
{
  "email": "abayomiogunnusi@gmail.com",
  "phone": "08045453423",
  "password": "1234",
  "username": "james",
  "dob": "2001-10-10",
  "gender": "Male"
}
```

Login a user

> POST /api/users/login

```json
{
  "email": "abayomiogunnusi@gmail.com",
  "password": "1234"
}
```

#### Grant Routes

#### Approve a grant

> localhost:7878/api/users/approve-grant/1

```json
{
  "grant_status": "Approved"
}
```

{
Authorization: "Bearer token"
}

#### Reject a grant

> localhost:7878/api/users/reject-grant/1

```json
{
  "grant_status": "Rejected"
}
```

{
Authorization: "Bearer token"
}

#### Get grant stats - Admin

> localhost:7878/api/users/grant-stats

{
Authorization: "Bearer token"
}

#### Get users stats - Admin

> localhost:7878/api/users/stats

{
Authorization: "Bearer token"
}

#### search all users - Admin

> localhost:7878/api/users/search?search=a

{
Authorization: "Bearer token"
}

#### search all grants - Admin

> localhost:7878/api/users/grant?search=a

{
Authorization: "Bearer token"
}

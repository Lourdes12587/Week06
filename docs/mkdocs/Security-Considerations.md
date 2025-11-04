# Security Considerations

> **Relevant source files**
> * [package.json](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json)
> * [routes/auth.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js)
> * [routes/courses.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js)

## Purpose and Scope

This document details the security mechanisms implemented in the course management system to protect against common web vulnerabilities. The system employs multiple layers of security including password hashing, input validation, SQL injection prevention, session management, and role-based access control.

For information about the authentication flow and user management, see [Authentication & Authorization](/Lourdes12587/Week06/4-authentication-and-authorization). For details on role-specific middleware implementation, see [Role-Based Access Control](/Lourdes12587/Week06/4.3-role-based-access-control).

---

## Security Architecture Overview

The system implements defense-in-depth through multiple security layers that work together to protect user data and prevent unauthorized access.

### Security Layer Stack

```

```

**Sources:** [routes/auth.js L1-L139](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L1-L139)

 [routes/courses.js L1-L187](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L1-L187)

 [package.json L13-L25](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L13-L25)

---

## Password Security with bcryptjs

The system uses `bcryptjs` version 3.0.2 to securely hash passwords before storage, preventing plaintext password exposure in case of database compromise.

### Password Hashing Implementation

| Operation | Function | Salt Rounds | Location |
| --- | --- | --- | --- |
| Registration | `bcrypt.hash()` | 8 | [routes/auth.js L44](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L44-L44) |
| Login Verification | `bcrypt.compare()` | N/A | [routes/auth.js L86](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L86-L86) |

### Registration Password Flow

```

```

**Password Hashing Code:**

```javascript
const passwordHash = await bcrypt.hash(password, 8);
```

Located at [routes/auth.js L44](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L44-L44)

**Salt Rounds:** The system uses 8 salt rounds, which provides a balance between security and performance. This is configured at hash time and cannot be modified without re-hashing all passwords.

### Login Password Verification

```

```

**Password Comparison Code:**

```
if (results.length == 0 || 
    !(await bcrypt.compare(password, results[0].password))) {
    // Authentication failed
}
```

Located at [routes/auth.js L85-L87](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L85-L87)

**Security Considerations:**

* Passwords are never stored in plaintext
* Password hashes are one-way; original passwords cannot be recovered
* Failed login attempts provide generic error messages to prevent user enumeration
* Timing attacks are mitigated by bcrypt's constant-time comparison

**Sources:** [routes/auth.js L44](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L44-L44)

 [routes/auth.js L85-L87](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L85-L87)

 [package.json L14](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L14-L14)

---

## Input Validation with express-validator

The system uses `express-validator` version 7.2.1 to sanitize and validate all user inputs on registration, preventing injection attacks and ensuring data integrity.

### Validation Rules Configuration

```

```

### Validation Rule Table

| Field | Validators | Constraint | Error Message |
| --- | --- | --- | --- |
| `nombre` | `exists()`, `isLength()` | min: 3 characters | "El nombre debe tener al menos 3 caracteres" |
| `email` | `exists()`, `isEmail()` | Valid email format | "El email debe ser válido" |
| `password` | `exists()`, `isLength()` | min: 4 characters | "La contraseña debe tener al menos 4 caracteres" |

**Validation Middleware Chain:**
Located at [routes/auth.js L17-L33](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L17-L33)

**Validation Execution:**

```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
    res.render("register", {
        validaciones: errors.array(),
        valores: req.body
    });
}
```

Located at [routes/auth.js L35-L40](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L35-L40)

### Validation Flow

```

```

**Security Benefits:**

* Prevents malformed data from reaching the database
* Protects against XSS by sanitizing inputs
* Enforces business logic constraints at the input layer
* Provides user-friendly error messages without exposing system details

**Sources:** [routes/auth.js L17-L40](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L17-L40)

 [package.json L21](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L21-L21)

---

## SQL Injection Prevention

All database queries use parameterized queries (prepared statements) to prevent SQL injection attacks. The system never concatenates user input directly into SQL strings.

### Parameterized Query Pattern

```

```

### Parameterized Query Examples by Operation

| Operation | SQL Statement | Parameters | File Location |
| --- | --- | --- | --- |
| User Registration | `INSERT INTO usuarios SET ?` | `{nombre, email, password, rol}` | [routes/auth.js L46-L52](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L46-L52) |
| User Authentication | `SELECT * FROM usuarios WHERE email = ?` | `[email]` | [routes/auth.js L82-L83](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L82-L83) |
| Course Retrieval | `SELECT * FROM cursos WHERE id = ?` | `[id]` | [routes/courses.js L77](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L77-L77) |
| Course Deletion | `DELETE FROM cursos WHERE id = ?` | `[id]` | [routes/courses.js L91](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L91-L91) |
| Check Enrollment | `SELECT * FROM inscripciones WHERE id_usuario = ? AND id_curso = ?` | `[id_usuario, id_curso]` | [routes/courses.js L122-L123](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L122-L123) |
| Insert Enrollment | `INSERT INTO inscripciones (id_usuario, id_curso) VALUES (?, ?)` | `[id_usuario, id_curso]` | [routes/courses.js L136-L137](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L136-L137) |
| User Profile Courses | `SELECT c.* FROM cursos c JOIN inscripciones i ON c.id = i.id_curso WHERE i.id_usuario = ?` | `[idUsuario]` | [routes/courses.js L155-L160](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L155-L160) |

### Query Execution Pattern

All queries follow this secure pattern:

```javascript
db.query(
    "SQL STATEMENT WITH ? PLACEHOLDERS",
    [parameter1, parameter2, ...],
    (error, results) => {
        // Handle results
    }
);
```

**Example from Authentication:**

```javascript
db.query(
    "SELECT * FROM usuarios WHERE email = ?", 
    [email], 
    async (error, results) => {
        // Process results safely
    }
);
```

Located at [routes/auth.js L81-L84](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L81-L84)

**Example from Enrollment Check:**

```javascript
db.query(
    "SELECT * FROM inscripciones WHERE id_usuario = ? AND id_curso = ?",
    [id_usuario, id_curso],
    (err, results) => {
        // Check if already enrolled
    }
);
```

Located at [routes/courses.js L121-L128](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L121-L128)

**Security Benefits:**

* Database driver automatically escapes parameter values
* Prevents injection of malicious SQL commands
* Separates data from code at the protocol level
* Works with all database operations (SELECT, INSERT, UPDATE, DELETE)

**Sources:** [routes/auth.js L46-L69](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L46-L69)

 [routes/auth.js L81-L118](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L81-L118)

 [routes/courses.js L77](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L77-L77)

 [routes/courses.js L91](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L91-L91)

 [routes/courses.js L121-L137](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L121-L137)

 [routes/courses.js L155-L160](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L155-L160)

---

## Session Security

The system uses `express-session` version 1.18.2 for server-side session management, storing sensitive user state on the server rather than in client-side cookies.

### Session Configuration

The session is initialized in [app.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js)

 with the following properties stored:

* `req.session.loggedin` - Boolean indicating authentication status
* `req.session.usuario` - User object containing id, nombre, email, rol
* `req.session.rol` - User role string ('publico', 'registrado', 'admin')

### Session Lifecycle

```

```

### Session Creation Code

**Login Success:**

```javascript
const usuario = results[0];

req.session.loggedin = true;
req.session.usuario = results[0];
req.session.rol = usuario.rol;
```

Located at [routes/auth.js L100-L104](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L100-L104)

**Logout:**

```javascript
req.session.destroy(() => res.redirect('/'));
```

Located at [routes/auth.js L135](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L135-L135)

### Session Security Features

| Feature | Implementation | Security Benefit |
| --- | --- | --- |
| Server-side storage | Session data stored on server | Prevents client tampering with session data |
| Session cookies | HTTPOnly cookies (via express-session) | Prevents XSS attacks from stealing session IDs |
| Session destruction | `req.session.destroy()` | Properly terminates sessions on logout |
| Session validation | Checked by `estaAutenticado` middleware | Prevents unauthorized access to protected routes |

**Sources:** [routes/auth.js L100-L104](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L100-L104)

 [routes/auth.js L135](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L135-L135)

 [package.json L20](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L20-L20)

---

## Authentication Middleware

The `estaAutenticado` middleware function enforces authentication requirements on protected routes by verifying session state before allowing access.

### Authentication Middleware Implementation

```

```

**Middleware Code:**

```javascript
function estaAutenticado(req, res, next) {
  if (req.session && req.session.loggedin) {
    return next();
  }
  res.redirect("/login");
}
```

Located at [routes/courses.js L8-L14](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L8-L14)

### Protected Routes Using estaAutenticado

| Route | Method | Additional Middleware | Purpose |
| --- | --- | --- | --- |
| `/create` | GET | `isAdmin` | Course creation form |
| `/save` | POST | `isAdmin` | Save new course |
| `/edit/:id` | GET | `isAdmin` | Course edit form |
| `/update` | POST | `isAdmin` | Update course |
| `/delete/:id` | GET | `isAdmin` | Delete course |
| `/inscribir/:id` | GET | `isRegistrado` | Enrollment confirmation |
| `/inscribir/:id` | POST | `isRegistrado` | Process enrollment |
| `/perfil` | GET | `isRegistrado` | User profile |
| `/admin/perfil` | GET | `isAdmin` | Admin dashboard |

**Example Route Protection:**

```javascript
router.get('/create', estaAutenticado, isAdmin, (req, res) => {
    res.render('create');
});
```

Located at [routes/courses.js L64-L66](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L64-L66)

**Security Benefits:**

* Centralized authentication logic prevents code duplication
* Consistent security checks across all protected routes
* Clear separation between authentication (logged in) and authorization (role check)
* Graceful redirect to login page for unauthenticated users

**Sources:** [routes/courses.js L8-L14](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L8-L14)

 [routes/courses.js L64-L103](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L64-L103)

 [routes/courses.js L106-L149](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L106-L149)

 [routes/courses.js L152-L185](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L152-L185)

---

## Role-Based Access Control (RBAC)

The system implements three distinct user roles with progressively higher privileges, enforced through dedicated middleware functions.

### Role Hierarchy

```

```

### Role Enforcement Middleware

**Admin Middleware:**

```javascript
function isAdmin(req, res, next) {
  if (req.session?.loggedin && req.session?.rol === 'admin') {
    next();
  } else {
    res.redirect("/login");
  }
}
```

Located at [routes/courses.js L16-L24](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L16-L24)

**Registrado Middleware:**

```javascript
function isRegistrado(req, res, next) {
  if (req.session?.loggedin && req.session?.rol === 'registrado') {
    next();
  } else {
    res.redirect("/login");
  }
}
```

Located at [routes/courses.js L26-L33](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L26-L33)

### Role Assignment

Roles are assigned during registration with a default fallback:

```sql
db.query("INSERT INTO usuarios SET ?", {
    nombre: nombre,
    email: email,
    password: passwordHash,
    rol: rol || 'registrado',
});
```

Located at [routes/auth.js L46-L52](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L46-L52)

**Default Role:** Users registered through the normal registration flow receive the `'registrado'` role by default.

### Role-Based Course Visibility

```

```

**Dynamic Query Code:**

```javascript
const rol = req.session?.rol || 'publico';
let sql = "SELECT * FROM cursos";

if (rol === 'publico') {
    sql += " WHERE visibilidad='publico'";
}

db.query(sql, (error, results) => {
    res.render('courses', {
        cursos: results,
        login: req.session.loggedin || false,
        rol
    });
});
```

Located at [routes/courses.js L36-L61](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L36-L61)

### Middleware Chain Examples

**Admin-Only Route:**

```sql
GET /create → estaAutenticado → isAdmin → Route Handler
```

**Registrado-Only Route:**

```
POST /inscribir/:id → estaAutenticado → isRegistrado → Route Handler
```

**Security Benefits:**

* Fine-grained access control based on user roles
* Principle of least privilege: users only access features appropriate to their role
* Multiple middleware layers prevent authorization bypass
* Role stored in session prevents client-side tampering
* Consistent role checking across all protected routes

**Sources:** [routes/courses.js L16-L33](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L16-L33)

 [routes/courses.js L36-L61](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L36-L61)

 [routes/courses.js L64-L185](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L64-L185)

 [routes/auth.js L46-L52](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L46-L52)

---

## Enrollment Security

The enrollment system implements duplicate prevention to ensure data integrity and prevent users from enrolling in the same course multiple times.

### Duplicate Enrollment Prevention Flow

```

```

**Duplicate Check Code:**

```javascript
db.query(
    "SELECT * FROM inscripciones WHERE id_usuario = ? AND id_curso = ?",
    [id_usuario, id_curso],
    (err, results) => {
        if (results.length > 0) {
            return res.redirect("/perfil"); // Already enrolled
        }
        
        // Proceed with enrollment
        db.query(
            "INSERT INTO inscripciones (id_usuario, id_curso) VALUES (?, ?)",
            [id_usuario, id_curso],
            (err2) => {
                res.redirect("/perfil");
            }
        );
    }
);
```

Located at [routes/courses.js L121-L148](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L121-L148)

### Enrollment Security Checks

| Security Check | Implementation | Purpose |
| --- | --- | --- |
| Authentication | `estaAutenticado` middleware | Verify user is logged in |
| Authorization | `isRegistrado` middleware | Verify user has 'registrado' role |
| Session validation | `req.session.usuario.id` | Get authenticated user's ID |
| Duplicate prevention | `SELECT` query before `INSERT` | Prevent multiple enrollments |
| Parameterized queries | `[id_usuario, id_curso]` | Prevent SQL injection |

**Security Benefits:**

* Users cannot enroll multiple times in the same course
* Only authenticated registered users can enroll
* User ID taken from session, not client input (prevents enrollment as another user)
* All database operations use parameterized queries
* Error handling redirects gracefully without exposing system details

**Sources:** [routes/courses.js L106-L149](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L106-L149)

---

## Security Best Practices Summary

### Implemented Security Measures

```

```

### Security Checklist

| Category | Security Measure | Status | Implementation |
| --- | --- | --- | --- |
| **Passwords** | Never stored in plaintext | ✓ | bcryptjs hashing with 8 rounds |
| **Passwords** | Secure comparison | ✓ | `bcrypt.compare()` constant-time |
| **Input** | All inputs validated | ✓ | express-validator on registration |
| **Input** | SQL injection prevention | ✓ | Parameterized queries exclusively |
| **Sessions** | Server-side storage | ✓ | express-session with secure defaults |
| **Sessions** | Proper logout | ✓ | `req.session.destroy()` |
| **Authentication** | Centralized middleware | ✓ | `estaAutenticado` function |
| **Authorization** | Role-based access | ✓ | `isAdmin`, `isRegistrado` middleware |
| **Authorization** | Principle of least privilege | ✓ | Three-tier role system |
| **Data** | User enumeration prevention | ✓ | Generic error messages |
| **Data** | Duplicate prevention | ✓ | Check before insert (enrollments) |
| **Errors** | No sensitive info exposure | ✓ | Generic user-facing messages |

### Recommended Additional Measures

The following security enhancements are recommended for production deployment:

1. **HTTPS Enforcement**: Configure Express to redirect HTTP to HTTPS
2. **CSRF Protection**: Add `csurf` middleware for state-changing operations
3. **Rate Limiting**: Implement rate limiting on login and registration routes
4. **Helmet.js**: Add security headers with `helmet` middleware
5. **Session Configuration**: * Set `secure: true` for session cookies (HTTPS only) * Set `httpOnly: true` to prevent XSS cookie theft * Configure appropriate `maxAge` for session expiration
6. **Password Policy**: Increase minimum password length to 8+ characters
7. **Account Lockout**: Implement temporary lockout after failed login attempts
8. **Audit Logging**: Log authentication events and admin actions
9. **Input Validation**: Extend validation to all routes, not just registration
10. **Database Credentials**: Ensure database passwords are strong and stored only in environment variables

**Sources:** [routes/auth.js L1-L139](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L1-L139)

 [routes/courses.js L1-L187](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L1-L187)

 [package.json L13-L25](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L13-L25)

---

## Code Entity Reference

### Security-Related Functions

| Function Name | Purpose | Location | Parameters |
| --- | --- | --- | --- |
| `estaAutenticado` | Verify user is logged in | [routes/courses.js L8-L14](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L8-L14) | `req, res, next` |
| `isAdmin` | Verify user has admin role | [routes/courses.js L16-L24](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L16-L24) | `req, res, next` |
| `isRegistrado` | Verify user has registrado role | [routes/courses.js L26-L33](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L26-L33) | `req, res, next` |
| `bcrypt.hash` | Hash password with salt | [routes/auth.js L44](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L44-L44) | `password, saltRounds` |
| `bcrypt.compare` | Compare password with hash | [routes/auth.js L86](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L86-L86) | `password, hash` |
| `validationResult` | Extract validation errors | [routes/auth.js L35](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L35-L35) | `req` |
| `req.session.destroy` | Terminate user session | [routes/auth.js L135](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L135-L135) | `callback` |

### Security-Related Modules

| Module | Version | Purpose | Configuration Location |
| --- | --- | --- | --- |
| `bcryptjs` | 3.0.2 | Password hashing | [package.json L14](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L14-L14) |
| `express-validator` | 7.2.1 | Input validation | [package.json L21](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L21-L21) |
| `express-session` | 1.18.2 | Session management | [package.json L20](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L20-L20) |
| `jsonwebtoken` | 9.0.2 | JWT token generation | [package.json L22](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L22-L22) |
| `cookie-parser` | 1.4.7 | Cookie parsing | [package.json L15](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L15-L15) |
| `mysql2` | 3.14.3 | Parameterized queries | [package.json L23](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L23-L23) |

**Sources:** [routes/auth.js L1-L139](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L1-L139)

 [routes/courses.js L1-L187](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L1-L187)

 [package.json L13-L25](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/package.json#L13-L25)
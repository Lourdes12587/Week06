# API Reference

> **Relevant source files**
> * [routes/auth.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js)
> * [routes/courses.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js)
> * [routes/index.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js)

This document provides a comprehensive reference for all HTTP endpoints available in the course management system. It details the request methods, URL patterns, authentication requirements, role-based access restrictions, request parameters, and response formats for each endpoint.

For information about authentication mechanisms and middleware implementation, see [Authentication & Authorization](/Lourdes12587/Week06/4-authentication-and-authorization). For details about the underlying database operations, see [Database Architecture](/Lourdes12587/Week06/3.3-database-architecture). For route implementation patterns and middleware chains, see [Routing System](/Lourdes12587/Week06/3.4-routing-system).

---

## Endpoint Organization

The application exposes HTTP endpoints organized into four functional groups: authentication operations, course management, enrollment operations, and user profiles. All endpoints follow RESTful conventions where applicable, though some operations use form-based POST requests with redirects rather than JSON APIs.

### Endpoint Overview Diagram

```

```

**Sources:** [routes/auth.js L1-L139](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L1-L139)

 [routes/courses.js L1-L187](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L1-L187)

 [routes/index.js L1-L18](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js#L1-L18)

---

## Endpoint Summary Table

| Endpoint | Method | Auth Required | Role Required | Controller/Handler | Purpose |
| --- | --- | --- | --- | --- | --- |
| `/` | GET | No | None | [routes/index.js L6](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js#L6-L6) | Landing page |
| `/login` | GET | No | None | [routes/auth.js L8](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L8-L8) | Display login form |
| `/register` | GET | No | None | [routes/auth.js L12](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L12-L12) | Display registration form |
| `/register` | POST | No | None | [routes/auth.js L17-L72](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L17-L72) | Process user registration |
| `/auth` | POST | No | None | [routes/auth.js L75-L131](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L75-L131) | Authenticate user login |
| `/logout` | POST | Yes | Any | [routes/auth.js L134-L136](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L134-L136) | Destroy session and logout |
| `/courses` | GET | No | None | [routes/courses.js L35-L62](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L35-L62) | List courses (filtered by role) |
| `/create` | GET | Yes | `admin` | [routes/courses.js L64-L67](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L64-L67) | Display course creation form |
| `/save` | POST | Yes | `admin` | [routes/courses.js L70](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L70-L70) | Save new course via `crud.save` |
| `/edit/:id` | GET | Yes | `admin` | [routes/courses.js L73-L84](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L73-L84) | Display course edit form |
| `/update` | POST | Yes | `admin` | [routes/courses.js L103](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L103-L103) | Update course via `crud.update` |
| `/delete/:id` | GET | Yes | `admin` | [routes/courses.js L87-L98](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L87-L98) | Delete course |
| `/inscribir/:id` | GET | Yes | `registrado` | [routes/courses.js L106-L114](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L106-L114) | Display enrollment confirmation |
| `/inscribir/:id` | POST | Yes | `registrado` | [routes/courses.js L117-L149](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L117-L149) | Process course enrollment |
| `/perfil` | GET | Yes | `registrado` | [routes/courses.js L152-L169](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L152-L169) | Display user profile |
| `/admin/perfil` | GET | Yes | `admin` | [routes/courses.js L172-L185](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L172-L185) | Display admin dashboard |

**Sources:** [routes/auth.js L1-L139](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L1-L139)

 [routes/courses.js L1-L187](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L1-L187)

 [routes/index.js L1-L18](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js#L1-L18)

---

## Authentication Requirements

### Middleware Chain Diagram

```

```

**Sources:** [routes/courses.js L8-L33](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L8-L33)

 [app.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js)

### Session Structure

When a user authenticates successfully via `POST /auth`, the following session properties are set:

| Session Property | Type | Description | Set At |
| --- | --- | --- | --- |
| `req.session.loggedin` | `boolean` | Authentication status flag | [routes/auth.js L102](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L102-L102) |
| `req.session.usuario` | `object` | Complete user record from database | [routes/auth.js L103](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L103-L103) |
| `req.session.rol` | `string` | User role: `'publico'`, `'registrado'`, or `'admin'` | [routes/auth.js L104](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L104-L104) |

**Sources:** [routes/auth.js L98-L116](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L98-L116)

---

## Authentication Endpoints

### GET /login

Renders the login form interface.

**Request:**

* Method: `GET`
* Authentication: Not required
* Parameters: None

**Response:**

* Type: HTML (EJS template)
* Template: `views/login.ejs`
* Status: `200 OK`

**Implementation:** [routes/auth.js L8-L10](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L8-L10)

---

### POST /auth

Authenticates user credentials and establishes a session.

**Request:**

* Method: `POST`
* Content-Type: `application/x-www-form-urlencoded`
* Authentication: Not required

**Request Body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | `string` | Yes | User email address |
| `password` | `string` | Yes | Plain-text password |

**Process Flow:**

1. Extract email and password from request body [routes/auth.js L77-L78](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L77-L78)
2. Query database for user by email [routes/auth.js L81-L84](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L81-L84)
3. Compare password hash using `bcrypt.compare()` [routes/auth.js L86](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L86-L86)
4. If valid, set session properties [routes/auth.js L102-L104](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L102-L104)
5. Render response with SweetAlert2 configuration

**Success Response:**

* Template: `views/login.ejs`
* Alert configuration: * `alertTitle`: "Conexion exitosa" * `alertIcon`: "success" * `timer`: 1500ms * `ruta`: "" (redirects to home)

**Error Response (Invalid Credentials):**

* Template: `views/login.ejs`
* Alert configuration: * `alertTitle`: "Error" * `alertMessage`: "Usuario y/o contraseña incorrectos" * `alertIcon`: "error" * Implemented at [routes/auth.js L88-L97](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L88-L97)

**Error Response (Missing Fields):**

* Alert configuration: * `alertTitle`: "Advertencia" * `alertMessage`: "Ingrese el usuario y/o contraseña" * Implemented at [routes/auth.js L119-L130](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L119-L130)

**Implementation:** [routes/auth.js L75-L131](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L75-L131)

**Database Query:**

```

```

**Sources:** [routes/auth.js L75-L131](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L75-L131)

 [config/db.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js)

---

### GET /register

Renders the user registration form.

**Request:**

* Method: `GET`
* Authentication: Not required
* Parameters: None

**Response:**

* Type: HTML (EJS template)
* Template: `views/register.ejs`
* Template Variables: `{ register: true }`

**Implementation:** [routes/auth.js L12-L14](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L12-L14)

---

### POST /register

Creates a new user account with validation.

**Request:**

* Method: `POST`
* Content-Type: `application/x-www-form-urlencoded`
* Authentication: Not required

**Request Body:**

| Field | Type | Required | Validation Rules |
| --- | --- | --- | --- |
| `nombre` | `string` | Yes | Minimum 3 characters |
| `email` | `string` | Yes | Valid email format |
| `password` | `string` | Yes | Minimum 4 characters |
| `rol` | `string` | No | Defaults to `'registrado'` |

**Validation Configuration:** [routes/auth.js L18-L33](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L18-L33)

**Process Flow:**

1. Validate input using `express-validator` [routes/auth.js L35-L40](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L35-L40)
2. If validation fails, re-render form with errors
3. Hash password using `bcrypt.hash()` with salt rounds = 8 [routes/auth.js L44](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L44-L44)
4. Insert user into `usuarios` table [routes/auth.js L46-L53](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L46-L53)
5. Render success response

**Success Response:**

* Template: `views/register.ejs`
* Alert configuration: * `alertTitle`: "Registro exitoso" * `alertMessage`: "Tu cuenta fue creada" * `alertIcon`: "success" * `timer`: 2500ms * `ruta`: "login"

**Validation Error Response:**

* Template: `views/register.ejs`
* Template Variables: * `validaciones`: Array of validation errors * `valores`: Original request body

**Implementation:** [routes/auth.js L17-L72](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L17-L72)

**Database Query:**

```

```

**Sources:** [routes/auth.js L17-L72](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L17-L72)

 [config/db.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js)

---

### POST /logout

Destroys the user session and logs out.

**Request:**

* Method: `POST`
* Authentication: Required (any authenticated user)
* Parameters: None

**Response:**

* Type: HTTP Redirect
* Location: `/` (home page)
* Status: `302 Found`

**Implementation:** [routes/auth.js L134-L136](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L134-L136)

**Sources:** [routes/auth.js L134-L136](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L134-L136)

---

## Course Management Endpoints

### GET /courses

Lists courses with visibility filtering based on user role.

**Request:**

* Method: `GET`
* Authentication: Not required
* Parameters: None

**Response:**

* Type: HTML (EJS template)
* Template: `views/courses.ejs`

**Template Variables:**

| Variable | Type | Description |
| --- | --- | --- |
| `cursos` | `Array<Object>` | Course records from database |
| `login` | `boolean` | Authentication status |
| `rol` | `string` | User role or `'publico'` |

**Role-Based Filtering:**

| User Role | SQL Query | Behavior |
| --- | --- | --- |
| `publico` (not logged in) | `SELECT * FROM cursos WHERE visibilidad='publico'` | Shows only public courses |
| `registrado` | `SELECT * FROM cursos` | Shows all courses |
| `admin` | `SELECT * FROM cursos` | Shows all courses |

**Filtering Logic:** [routes/courses.js L36-L42](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L36-L42)

**Implementation:** [routes/courses.js L35-L62](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L35-L62)

**Database Query:**

```

```

**Sources:** [routes/courses.js L35-L62](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L35-L62)

 [config/db.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js)

---

### GET /create

Displays the course creation form (admin only).

**Request:**

* Method: `GET`
* Authentication: Required
* Role: `admin`
* Middleware: `estaAutenticado`, `isAdmin` [routes/courses.js L64](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L64-L64)

**Response:**

* Type: HTML (EJS template)
* Template: `views/create.ejs`

**Authorization Failure:**

* Redirects to `/login` if not authenticated or not admin

**Implementation:** [routes/courses.js L64-L67](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L64-L67)

**Sources:** [routes/courses.js L64-L67](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L64-L67)

---

### POST /save

Creates a new course record (admin only).

**Request:**

* Method: `POST`
* Content-Type: `application/x-www-form-urlencoded`
* Authentication: Required
* Role: `admin`
* Middleware: `estaAutenticado`, `isAdmin` [routes/courses.js L70](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L70-L70)

**Request Body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `titulo` | `string` | Yes | Course title |
| `descripcion` | `string` | Yes | Course description |
| `categoria` | `string` | Yes | Course category |
| `visibilidad` | `string` | Yes | `'publico'` or `'privado'` |

**Response:**

* Type: HTTP Redirect
* Delegates to: `crud.save` controller [src/controller.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js)
* Typically redirects to `/courses` after successful creation

**Implementation:** [routes/courses.js L70](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L70-L70)

**Database Query (via controller):**

```

```

**Sources:** [routes/courses.js L70](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L70-L70)

 [src/controller.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js)

---

### GET /edit/:id

Displays the course edit form pre-populated with existing data (admin only).

**Request:**

* Method: `GET`
* Authentication: Required
* Role: `admin`
* Middleware: `estaAutenticado`, `isAdmin` [routes/courses.js L73](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L73-L73)

**URL Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `integer` | Course ID to edit |

**Response:**

* Type: HTML (EJS template)
* Template: `views/edit.ejs`
* Template Variables: `{ curso: <course_object> }`

**Process:**

1. Extract course ID from URL parameters [routes/courses.js L75](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L75-L75)
2. Query database for course record [routes/courses.js L77](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L77-L77)
3. Render edit form with course data [routes/courses.js L81](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L81-L81)

**Implementation:** [routes/courses.js L73-L84](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L73-L84)

**Database Query:**

```

```

**Sources:** [routes/courses.js L73-L84](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L73-L84)

 [config/db.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js)

---

### POST /update

Updates an existing course record (admin only).

**Request:**

* Method: `POST`
* Content-Type: `application/x-www-form-urlencoded`
* Authentication: Required
* Role: `admin`
* Middleware: `estaAutenticado`, `isAdmin` [routes/courses.js L103](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L103-L103)

**Request Body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer` | Yes | Course ID to update |
| `titulo` | `string` | Yes | Updated course title |
| `descripcion` | `string` | Yes | Updated description |
| `categoria` | `string` | Yes | Updated category |
| `visibilidad` | `string` | Yes | Updated visibility |

**Response:**

* Type: HTTP Redirect
* Delegates to: `crud.update` controller [src/controller.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js)
* Typically redirects to `/courses` after successful update

**Implementation:** [routes/courses.js L103](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L103-L103)

**Database Query (via controller):**

```

```

**Sources:** [routes/courses.js L103](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L103-L103)

 [src/controller.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js)

---

### GET /delete/:id

Deletes a course record (admin only).

**Request:**

* Method: `GET`
* Authentication: Required
* Role: `admin`
* Middleware: `estaAutenticado`, `isAdmin` [routes/courses.js L87](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L87-L87)

**URL Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `integer` | Course ID to delete |

**Response:**

* Type: HTTP Redirect
* Location: `/courses`
* Status: `302 Found`

**Process:**

1. Extract course ID from URL parameters [routes/courses.js L89](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L89-L89)
2. Execute DELETE query [routes/courses.js L91](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L91-L91)
3. Redirect to course listing [routes/courses.js L95](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L95-L95)

**Implementation:** [routes/courses.js L87-L98](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L87-L98)

**Database Query:**

```

```

**Note:** This operation may cascade to related `inscripciones` records depending on database foreign key constraints.

**Sources:** [routes/courses.js L87-L98](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L87-L98)

 [config/db.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js)

---

## Enrollment Endpoints

### Enrollment Flow Diagram

```

```

**Sources:** [routes/courses.js L106-L149](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L106-L149)

---

### GET /inscribir/:id

Displays enrollment confirmation page for a specific course (registrado only).

**Request:**

* Method: `GET`
* Authentication: Required
* Role: `registrado`
* Middleware: `estaAutenticado`, `isRegistrado` [routes/courses.js L106](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L106-L106)

**URL Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `integer` | Course ID to enroll in |

**Response:**

* Type: HTML (EJS template)
* Template: `views/confirmInscripcion.ejs`

**Template Variables:**

| Variable | Type | Description |
| --- | --- | --- |
| `curso` | `object` | Course record with details |
| `login` | `boolean` | Always `true` (authenticated) |
| `rol` | `string` | Always `'registrado'` |

**Process:**

1. Extract course ID [routes/courses.js L107](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L107-L107)
2. Query course details [routes/courses.js L109](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L109-L109)
3. If course not found, redirect to `/courses` [routes/courses.js L110](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L110-L110)
4. Otherwise render confirmation page [routes/courses.js L112](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L112-L112)

**Implementation:** [routes/courses.js L106-L114](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L106-L114)

**Database Query:**

```

```

**Sources:** [routes/courses.js L106-L114](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L106-L114)

 [config/db.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js)

---

### POST /inscribir/:id

Processes course enrollment with duplicate prevention (registrado only).

**Request:**

* Method: `POST`
* Authentication: Required
* Role: `registrado`
* Middleware: `estaAutenticado`, `isRegistrado` [routes/courses.js L117](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L117-L117)

**URL Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `integer` | Course ID to enroll in |

**Response:**

* Type: HTTP Redirect
* Location: `/perfil`
* Status: `302 Found`

**Process Flow:**

1. Extract course ID and user ID [routes/courses.js L118-L119](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L118-L119)
2. Check for existing enrollment [routes/courses.js L121-L128](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L121-L128)
3. If already enrolled, redirect to profile immediately [routes/courses.js L132](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L132-L132)
4. If not enrolled, insert enrollment record [routes/courses.js L135-L146](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L135-L146)
5. Redirect to profile to view enrolled courses [routes/courses.js L144](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L144-L144)

**Duplicate Prevention:**
The endpoint checks the `inscripciones` table before inserting to prevent duplicate enrollments [routes/courses.js L121-L133](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L121-L133)

**Implementation:** [routes/courses.js L117-L149](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L117-L149)

**Database Queries:**

```

```

**Error Handling:**

* Database errors redirect to `/courses` [routes/courses.js L127](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L127-L127)
* Duplicate enrollments silently redirect to profile (idempotent behavior)

**Sources:** [routes/courses.js L117-L149](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L117-L149)

 [config/db.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js)

---

## Profile Endpoints

### GET /perfil

Displays user profile with enrolled courses (registrado only).

**Request:**

* Method: `GET`
* Authentication: Required
* Role: `registrado`
* Middleware: `estaAutenticado`, `isRegistrado` [routes/courses.js L152](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L152-L152)

**Response:**

* Type: HTML (EJS template)
* Template: `views/perfil.ejs`

**Template Variables:**

| Variable | Type | Description |
| --- | --- | --- |
| `cursos` | `Array<Object>` | Enrolled courses with full details |
| `usuario` | `object` | User record from session |
| `rol` | `string` | Always `'registrado'` |
| `msg` | `string` | Optional query parameter message |

**Process:**

1. Extract user ID from session [routes/courses.js L154](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L154-L154)
2. Execute JOIN query to retrieve enrolled courses [routes/courses.js L155-L160](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L155-L160)
3. Render profile template with results [routes/courses.js L162-L168](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L162-L168)

**Implementation:** [routes/courses.js L152-L169](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L152-L169)

**Database Query:**

```

```

This query returns all course details for courses the user has enrolled in through the `inscripciones` junction table.

**Sources:** [routes/courses.js L152-L169](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L152-L169)

 [config/db.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js)

---

### GET /admin/perfil

Displays administrator dashboard with system statistics (admin only).

**Request:**

* Method: `GET`
* Authentication: Required
* Role: `admin`
* Middleware: `estaAutenticado`, `isAdmin` [routes/courses.js L172](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L172-L172)

**Response:**

* Type: HTML (EJS template)
* Template: `views/adminPerfil.ejs`

**Template Variables:**

| Variable | Type | Description |
| --- | --- | --- |
| `usuario` | `object` | Admin user record from session |
| `totalCursos` | `integer` | Total count of courses in system |

**Process:**

1. Extract user from session [routes/courses.js L173](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L173-L173)
2. Query total course count [routes/courses.js L176](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L176-L176)
3. Render admin dashboard [routes/courses.js L183](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L183-L183)

**Error Handling:**
If database query fails, renders template with `totalCursos: 0` [routes/courses.js L179](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L179-L179)

**Implementation:** [routes/courses.js L172-L185](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L172-L185)

**Database Query:**

```

```

**Sources:** [routes/courses.js L172-L185](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L172-L185)

 [config/db.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js)

---

## Error Handling Patterns

### Common Error Responses

| Scenario | HTTP Method | Response Type | Behavior |
| --- | --- | --- | --- |
| Unauthenticated access to protected route | Any | Redirect | `302` to `/login` |
| Invalid role for route | Any | Redirect | `302` to `/login` |
| Database query error | GET | HTML | Renders template with empty data |
| Database query error | POST | Redirect | `302` to appropriate page |
| Validation errors | POST | HTML | Re-renders form with error messages |
| Missing required fields | POST | HTML | Renders alert with error message |

**Sources:** [routes/courses.js L8-L33](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L8-L33)

 [routes/auth.js L35-L40](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L35-L40)

---

## Middleware Reference

### estaAutenticado

Verifies user has an active session.

**Implementation:** [routes/courses.js L8-L14](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L8-L14)

**Logic:**

```

```

**Sources:** [routes/courses.js L8-L14](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L8-L14)

---

### isAdmin

Verifies user has `admin` role.

**Implementation:** [routes/courses.js L16-L24](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L16-L24)

**Logic:**

```

```

**Sources:** [routes/courses.js L16-L24](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L16-L24)

---

### isRegistrado

Verifies user has `registrado` role.

**Implementation:** [routes/courses.js L26-L33](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L26-L33)

**Logic:**

```

```

**Sources:** [routes/courses.js L26-L33](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L26-L33)

---

## Database Table Reference

### usuarios Table

Stores user accounts and authentication data.

| Column | Type | Description |
| --- | --- | --- |
| `id` | `integer` | Primary key |
| `nombre` | `string` | User's display name |
| `email` | `string` | User email (unique) |
| `password` | `string` | bcrypt hash of password |
| `rol` | `enum` | `'publico'`, `'registrado'`, or `'admin'` |

**Sources:** [routes/auth.js L46-L53](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/auth.js#L46-L53)

---

### cursos Table

Stores course information.

| Column | Type | Description |
| --- | --- | --- |
| `id` | `integer` | Primary key |
| `titulo` | `string` | Course title |
| `descripcion` | `string` | Course description |
| `categoria` | `string` | Course category |
| `visibilidad` | `string` | `'publico'` or `'privado'` |

**Sources:** [routes/courses.js L77](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L77-L77)

---

### inscripciones Table

Junction table tracking course enrollments.

| Column | Type | Description |
| --- | --- | --- |
| `id_usuario` | `integer` | Foreign key to `usuarios.id` |
| `id_curso` | `integer` | Foreign key to `cursos.id` |

**Sources:** [routes/courses.js L122](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L122-L122)

 [routes/courses.js L136](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L136-L136)

 [routes/courses.js L158](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/courses.js#L158-L158)
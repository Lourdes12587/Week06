# Project Structure

> **Relevant source files**
> * [app.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js)
> * [config/db.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js)
> * [routes/index.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js)
> * [src/controller.js](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js)

## Purpose and Scope

This document describes the physical organization of the codebase, explaining the purpose of each directory and how files are organized within the system. It maps the folder structure to the architectural layers and explains the conventions used for organizing routes, controllers, views, and configuration files.

For information about the overall architecture and how these components interact, see [Architecture Overview](/Lourdes12587/Week06/3-architecture-overview). For guidance on adding new functionality to the codebase, see [Adding New Routes](/Lourdes12587/Week06/9.2-adding-new-routes).

---

## Directory Structure Overview

The project follows a modular organization pattern that separates concerns by file type and responsibility. The structure promotes maintainability by grouping related files together and establishing clear boundaries between presentation, application logic, and configuration.

### High-Level Directory Layout

```

```

**Directory Mapping to Architectural Layers:**

| Directory | Architectural Layer | Purpose |
| --- | --- | --- |
| `routes/` | Application Layer | HTTP endpoint definitions and request routing |
| `src/` | Application Layer | Business logic controllers and data manipulation |
| `config/` | Data Layer | Database connection and configuration management |
| `views/` | Presentation Layer | EJS templates for HTML rendering |
| `public/` | Presentation Layer | Static assets (CSS, images, client-side resources) |
| `env/` | Configuration | Environment variables and secrets |

**Sources:** [app.js L1-L41](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L1-L41)

 High-Level System Architecture Diagram

---

## Root Directory Files

### app.js - Application Entry Point

The `app.js` file serves as the main application entry point and orchestrates the entire Express application.

**Key Responsibilities:**

* Express application initialization ([app.js L1-L2](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L1-L2) )
* Environment configuration loading ([app.js L3](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L3-L3) )
* Session middleware setup ([app.js L6-L13](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L6-L13) )
* Static file serving configuration ([app.js L19](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L19-L19) )
* View engine configuration ([app.js L21](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L21-L21) )
* Body parsing middleware ([app.js L25-L26](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L25-L26) )
* Route mounting ([app.js L29-L31](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L29-L31) )

```

```

**Sources:** [app.js L1-L41](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L1-L41)

### package.json - Dependency Manifest

The `package.json` file defines all npm dependencies and project metadata. Key dependencies include:

| Dependency | Version | Purpose |
| --- | --- | --- |
| `express` | 5.1.0 | Web application framework |
| `ejs` | 3.1.10 | Template engine for views |
| `mysql2` | 3.14.3 | MySQL database driver |
| `bcryptjs` | 3.0.2 | Password hashing |
| `jsonwebtoken` | 9.0.2 | JWT token generation |
| `express-session` | 1.18.2 | Session management |
| `express-validator` | 7.2.1 | Input validation |
| `dotenv` | 17.2.1 | Environment variable loading |

**Sources:** Module Dependency & Technology Stack Diagram

---

## Routes Directory (routes/)

The `routes/` directory contains modular route handlers that define HTTP endpoints and delegate business logic to controllers. Each file represents a logical grouping of related endpoints.

### Route Organization Pattern

```

```

### index.js - Landing Page Routes

**File Purpose:** Handles the root endpoint and renders the landing page with dynamic content based on session state.

**Key Features:**

* Session-aware rendering ([routes/index.js L7](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js#L7-L7) )
* Dynamic user greeting ([routes/index.js L13](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js#L13-L13) )
* Login status tracking ([routes/index.js L12](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js#L12-L12) )

**Sources:** [routes/index.js L1-L18](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js#L1-L18)

### auth.js - Authentication Routes

**File Purpose:** Manages user registration, login, and logout functionality.

**Typical Route Structure:**

* Form display routes (GET)
* Form submission routes (POST)
* Input validation middleware
* Password hashing integration
* Session creation/destruction

**Sources:** Authentication & Authorization System Diagram, [Architecture Overview](/Lourdes12587/Week06/4-authentication-and-authorization)

### courses.js - Course Management Routes

**File Purpose:** Handles all course-related operations including CRUD operations, enrollment, and profile views.

**Route Categories:**

* **Public routes:** Course listing
* **Admin-only routes:** Create, edit, update, delete courses
* **Registered user routes:** Enrollment, user profile
* **Admin dashboard routes:** Admin profile, statistics

**Sources:** HTTP Request Flow & Routing Architecture Diagram

---

## Controllers Directory (src/)

The `src/` directory contains controller modules that implement business logic for data manipulation and database operations. Controllers are invoked by route handlers to process requests.

### Controller Organization

```

```

### controller.js - Course CRUD Controller

**File Purpose:** Implements create and update operations for courses.

**Exported Functions:**

| Function | Purpose | Database Operation |
| --- | --- | --- |
| `exports.save` | Create new course | `INSERT INTO cursos` ([src/controller.js L9-L10](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js#L9-L10) <br> ) |
| `exports.update` | Modify existing course | `UPDATE cursos SET ? WHERE id = ?` ([src/controller.js L36](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js#L36-L36) <br> ) |

**Pattern Used:**

1. Extract request body parameters ([src/controller.js L5-L7](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js#L5-L7) )
2. Execute parameterized database query
3. Handle errors and redirect ([src/controller.js L17-L23](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js#L17-L23) )

**Sources:** [src/controller.js L1-L53](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js#L1-L53)

### cursoController.js - Enrollment Controller

**File Purpose:** Manages course enrollment operations including duplicate prevention and database transactions.

**Key Functionality:**

* Enrollment validation
* Duplicate enrollment checking
* Junction table insertion (`inscripciones`)

**Sources:** Data Architecture & Entity Relationships Diagram

---

## Configuration Directory (config/)

The `config/` directory contains configuration modules that set up external service connections and system-wide settings.

### db.js - Database Connection Module

**File Purpose:** Establishes and exports a single MySQL database connection that is shared across the application.

```

```

**Configuration Pattern:**

* Connection parameters sourced from environment variables ([config/db.js L4-L7](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L4-L7) )
* Singleton connection instance ([config/db.js L3](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L3-L3) )
* Connection test on initialization ([config/db.js L11-L17](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L11-L17) )
* Exported for use across application ([config/db.js L19](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L19-L19) )

**Database Configuration:**

| Parameter | Environment Variable | Purpose |
| --- | --- | --- |
| `host` | `process.env.DB_HOST` | MySQL server hostname |
| `user` | `process.env.DB_USER` | Database username |
| `password` | `process.env.DB_PASS` | Database password |
| `database` | `process.env.DB_NAME` | Database name |

**Sources:** [config/db.js L1-L20](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L1-L20)

---

## Views Directory (views/)

The `views/` directory contains EJS template files that generate HTML responses. Templates use embedded JavaScript to render dynamic content based on data passed from route handlers.

### View Organization Structure

```

```

### Template Categories

| Template Type | Files | Purpose |
| --- | --- | --- |
| Landing | `index.ejs` | Home page with conditional content |
| Authentication | `login.ejs`, `register.ejs` | User authentication forms |
| Course Management | `courses.ejs`, `create.ejs`, `edit.ejs` | Course CRUD interfaces |
| Enrollment | `inscribir.ejs` | Two-step enrollment confirmation |
| Profiles | `perfil.ejs`, `adminPerfil.ejs` | User and admin dashboards |
| Shared Partials | `partials/head.ejs`, `partials/header.ejs` | Reusable template fragments |

**Rendering Pattern:**
Route handlers call `res.render()` with template name and data object:

```yaml
res.render("index", {
    nombre: "THOT",
    login: req.session.loggedin || false,
    name: usuario ? usuario.nombre : "Invitado"
});
```

**Sources:** [routes/index.js L9-L14](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js#L9-L14)

 Frontend Architecture Diagram

---

## Public Directory (public/)

The `public/` directory contains static assets served directly to clients without processing. The directory is mounted at the `/resources` URL path ([app.js L19](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L19-L19)

).

### Static Asset Organization

```

```

### Static File Serving Configuration

**URL Mapping:**

* File path: `public/css/style.css`
* Served at: `/resources/css/style.css`
* Configuration: [app.js L19](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L19-L19)

**Asset Categories:**

| Directory | Content Type | Examples |
| --- | --- | --- |
| `css/` | Stylesheets | Page-specific CSS, global styles |
| `resources/` | Media files | Images, icons, fonts |

**Styling Strategy:**
Each major view has a dedicated stylesheet that imports or extends global styles, providing page-specific visual customization while maintaining consistency.

**Sources:** [app.js L19](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L19-L19)

 Styling System Section

---

## Environment Configuration (env/)

The `env/` directory contains environment-specific configuration files that store sensitive credentials and deployment-specific settings.

### .env File Structure

**File Path:** `env/.env`
**Loading:** [app.js L3](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L3-L3)

**Required Variables:**

| Variable | Purpose | Used By |
| --- | --- | --- |
| `DB_HOST` | MySQL server address | [config/db.js L4](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L4-L4) |
| `DB_USER` | Database username | [config/db.js L5](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L5-L5) |
| `DB_PASS` | Database password | [config/db.js L6](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L6-L6) |
| `DB_NAME` | Database name | [config/db.js L7](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L7-L7) |

**Security Note:** This file should never be committed to version control. It contains sensitive credentials that must be kept secret.

**Sources:** [app.js L3](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L3-L3)

 [config/db.js L4-L7](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L4-L7)

---

## File Organization Patterns

### Naming Conventions

**Route Files:**

* Named after the resource or feature area (e.g., `auth.js`, `courses.js`)
* Use lowercase
* Export an Express Router instance

**Controller Files:**

* Suffixed with `Controller.js` (e.g., `cursoController.js`) or just descriptive (e.g., `controller.js`)
* Export functions as properties of `exports` object
* Functions named after their operations (e.g., `save`, `update`, `inscribir`)

**View Files:**

* Named after the page or action (e.g., `login.ejs`, `create.ejs`)
* Use camelCase for multi-word names
* Match the template name used in `res.render()` calls

**CSS Files:**

* Named to match their corresponding view (e.g., `login.css` for `login.ejs`)
* Global styles in `style.css`

### Module Import Pattern

The codebase uses CommonJS module syntax:

```javascript
// Importing modules
const express = require('express');
const db = require("../config/db");

// Exporting modules
module.exports = router;        // Single export
exports.save = (req, res) => {}; // Multiple exports
```

**Sources:** [app.js L1-L2](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L1-L2)

 [routes/index.js L2-L4](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js#L2-L4)

 [config/db.js L1](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L1-L1)

 [src/controller.js L1](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js#L1-L1)

---

## Dependency Flow Between Directories

```

```

**Import Hierarchy:**

1. **Top Level:** `app.js` loads environment config and mounts routes
2. **Route Level:** Routes require database config and controllers
3. **Controller Level:** Controllers require database config
4. **Data Level:** Database config reads environment variables

**Key Principle:** Each layer only imports from its own level or lower layers, maintaining unidirectional dependency flow.

**Sources:** [app.js L1-L31](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/app.js#L1-L31)

 [routes/index.js L2-L4](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/routes/index.js#L2-L4)

 [src/controller.js L1](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/src/controller.js#L1-L1)

 [config/db.js L1-L3](https://github.com/Lourdes12587/Week06/blob/ce0c3bcd/config/db.js#L1-L3)

---

## Summary

The project structure follows a layered architecture with clear separation of concerns:

* **Root files** (`app.js`, `package.json`) orchestrate the application
* **`routes/`** defines HTTP endpoints and request handling
* **`src/`** implements business logic and data manipulation
* **`config/`** manages external service connections
* **`views/`** contains presentation templates
* **`public/`** serves static client-side assets
* **`env/`** stores environment-specific configuration

This organization promotes maintainability by grouping related functionality, enforces architectural boundaries through directory structure, and makes the codebase navigable by establishing consistent naming and organization conventions.

For details on how to extend this structure with new features, see [Adding New Routes](/Lourdes12587/Week06/9.2-adding-new-routes). For information about the database schema accessed by these modules, see [Database Architecture](/Lourdes12587/Week06/3.3-database-architecture).
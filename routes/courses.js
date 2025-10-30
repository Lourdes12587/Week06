const express = require('express');
const router = express.Router();
//const bcrypt = require("bcryptjs"); 
const db = require("../config/db");
const crud = (require ("../src/controller"));
const cursoController = require("../src/cursoController");

function estaAutenticado(req, res, next) {
  if (req.session && req.session.loggedin) {
    return next();
  }
  //res.redirect("/auth/login");
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.session?.loggedin && req.session?.rol === 'admin') return next();
  return res.redirect("/login");
}

function isRegistrado(req, res, next) {
  if (req.session?.loggedin && req.session?.rol === 'registrado') return next();
  res.redirect("/login");
}

router.get('/courses', (req, res) => {
  const rol = req.session?.rol || 'publico';
  
  let sql = "SELECT * FROM cursos";

  if (rol === 'publico') {
    sql += " WHERE visibilidad='publico'";
  }

  db.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      return res.render('courses', {
        cursos: [],
        login: req.session.loggedin || false,
        //rol: req.session.rol || null
        //rol: req.session.rol 
        rol: req.session.rol || 'publico'
      });
    }

    res.render('courses', {
      cursos: results,
      login: req.session.loggedin || false,
      rol
    });
  });
});

router.get('/create', estaAutenticado, isAdmin, (req, res) => {
    res.render('create');

});

//guardar
router.post('/save', estaAutenticado, isAdmin, crud.save);

//editar
router.get("/edit/:id",estaAutenticado, isAdmin, (req, res) => {

    const id = req.params.id;

    db.query("SELECT * FROM cursos WHERE id = ?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
        res.render("edit", { curso: results[0] });
        }
    });
});

//borrar
router.get("/delete/:id", estaAutenticado, isAdmin,  (req, res) => {
  
    const id = req.params.id;

    db.query("DELETE FROM cursos WHERE id = ?", [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.redirect('/courses');
        }
    });
});



//actualizar
router.post('/update', estaAutenticado, isAdmin, crud.update);

//inscripcion
router.get("/inscribir/:id", estaAutenticado, isRegistrado, (req, res) => {
  const idCurso = req.params.id;

  db.query("SELECT * FROM cursos WHERE id = ?", [idCurso], (err, results) => {
    if (err || results.length === 0) return res.redirect("/courses");
    const curso = results[0];
    res.render("confirmInscripcion", { curso, login: req.session.loggedin, rol: req.session.rol });
  });
});

// Ruta para procesar inscripción
router.post("/inscribir/:id", estaAutenticado, isRegistrado, (req, res) => {
  const id_curso = req.params.id; 
  const id_usuario = req.session.usuario.id;

  db.query(
    "SELECT * FROM inscripciones WHERE id_usuario = ? AND id_curso = ?",
    [id_usuario, id_curso],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.redirect("/courses");
      }

      if (results.length > 0) {
   
        return res.redirect("/perfil");
      }

      db.query(
        "INSERT INTO inscripciones (id_usuario, id_curso) VALUES (?, ?)",
        [id_usuario, id_curso],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.redirect("/courses");
          }

          res.redirect("/perfil");
        }
      );
    }
  );
});

//perfil
router.get("/perfil", estaAutenticado, isRegistrado, (req, res) => {
  
  const idUsuario = req.session.usuario.id;
  const sql = `
    SELECT c.* 
    FROM cursos c
    JOIN inscripciones i ON c.id = i.id_curso
    WHERE i.id_usuario = ?
  `;
  db.query(sql, [idUsuario], (err, results) => {
    res.render("perfil", {
      cursos: results,
      usuario: req.session.usuario,
      rol: req.session.rol,
      msg: req.query.msg
    });
  });
});

//perfiladmin
router.get("/admin/perfil", estaAutenticado, isAdmin, (req, res) => {
  const usuario = req.session.usuario;
  
  // Aquí puedes cargar info específica de admin, como estadísticas de cursos
  db.query("SELECT COUNT(*) AS totalCursos FROM cursos", (err, results) => {
    if (err) {
      console.error(err);
      return res.render("adminPerfil", { usuario, totalCursos: 0 });
    }

    const totalCursos = results[0].totalCursos;
    res.render("adminPerfil", { usuario, totalCursos });
  });
});

module.exports = router;
const db = require("../config/db");

exports.inscribirCurso = (req, res) => {
  const id_curso = req.params.id;
  const id_usuario = req.session.usuario.id;

  db.query(
    "SELECT * FROM inscripciones WHERE id_usuario = ? AND id_curso = ?",
    [id_usuario, id_curso],
    (err, results) => {
      if (err) return res.redirect("/courses");

      if (results.length > 0) return res.redirect("/perfil");

      db.query(
        "INSERT INTO inscripciones (id_usuario, id_curso) VALUES (?, ?)",
        [id_usuario, id_curso],
        (err2) => {
          if (err2) return res.redirect("/courses");
          res.redirect("/perfil");
        }
      );
    }
  );
};
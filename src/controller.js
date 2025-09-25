const db = require("../config/db");

//GUARDAR
exports.save = (req, res) => {
    const titulo = req.body.titulo;
    const descripcion = req.body.descripcion;
    const categoria = req.body.categoria;

    db.query(
        "INSERT INTO cursos SET ?",
        {
            titulo: titulo,
            descripcion: descripcion,
            categoria: categoria,
        },
        (error, results) => {
            if (error) {
                console.log(error);
                res.redirect("/courses");
            } else {
                res.redirect("/courses");
            }
        }
    );
};

//ACTUALIZAR
exports.update = (req, res) => {
    
    const id = req.body.id;
    const titulo = req.body.titulo;
    const descripcion = req.body.descripcion;
    const categoria = req.body.categoria;

    db.query(
        "UPDATE cursos SET ? WHERE id = ?", [{

            titulo: titulo,
            descripcion: descripcion,
            categoria: categoria,
        }
        , id,
    ],
        (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect("/courses");
            }
        }
    );
};

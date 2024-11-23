const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const rutaRepertorio = path.join(__dirname, "repertorio.json");

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/canciones", (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync(rutaRepertorio, "utf8"));
    res.json(canciones);
  } catch (error) {
    res.status(500).json({ error: "Error al leer el archivo de repertorio" });
  }
});

app.post("/canciones", (req, res) => {
  try {
    const nuevaCancion = req.body;
    const canciones = JSON.parse(fs.readFileSync(rutaRepertorio, "utf8"));

    canciones.push(nuevaCancion);
    fs.writeFileSync(rutaRepertorio, JSON.stringify(canciones, null, 2));

    res.status(201).json({ mensaje: "Canción agregada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar la nueva canción" });
  }
});

app.put("/canciones/:id", (req, res) => {
  try {
    const { id } = req.params;
    const cancionActualizada = req.body;
    let canciones = JSON.parse(fs.readFileSync(rutaRepertorio, "utf8"));

    canciones = canciones.map((cancion) =>
      cancion.id == id ? { ...cancion, ...cancionActualizada } : cancion
    );

    fs.writeFileSync(rutaRepertorio, JSON.stringify(canciones, null, 2));
    res.json({ mensaje: "Canción actualizada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la canción" });
  }
});

app.delete("/canciones/:id", (req, res) => {
  try {
    const { id } = req.params;
    let canciones = JSON.parse(fs.readFileSync(rutaRepertorio, "utf8"));

    canciones = canciones.filter((cancion) => cancion.id != id);

    fs.writeFileSync(rutaRepertorio, JSON.stringify(canciones, null, 2));
    res.json({ mensaje: "Canción eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la canción" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

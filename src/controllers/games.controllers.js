import { connection } from "../database/database.connection.js"

export async function insertGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    const gameExist = await connection.query(
      "SELECT * FROM games WHERE name=$1",
      [name]
    );

    if (gameExist.rowCount !== 0) return res.sendStatus(409);

    await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',
      [name, image, stockTotal, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getGames(req, res) {
  const { offset, limit, name } = req.query
  console.log(name)
  try {

    let games = await connection.query("SELECT * FROM games LIMIT $1 OFFSET $2", [limit, offset])

    if (name) games = await connection.query(`SELECT * FROM games WHERE name ILIKE $1::text || '%' LIMIT $2 OFFSET $3`, [name, limit, offset])

    res.status(201).send(games.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

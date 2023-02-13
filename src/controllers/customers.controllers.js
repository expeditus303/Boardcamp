import { connection } from "../database/database.connection.js";

export async function insertCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const cpfExists = await connection.query(
      "SELECT * FROM customers WHERE cpf=$1",
      [cpf]
    );
    
    if (cpfExists.rowCount !== 0) return res.sendStatus(409);

    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
      [name, phone, cpf, birthday]
    );
    
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getCustomers(req, res) {
  const { offset, limit } = req.query

  try {

    let customers;

    if (offset) customers = await connection.query("SELECT * FROM customers OFFSET $1", [offset])

    if (limit) customers = await connection.query("SELECT * FROM customers LIMIT $1", [limit])

    if (offset && limit) customers = await connection.query("SELECT * FROM customers LIMIT $1 OFFSET $2", [limit, offset])
    
    if (!offset && !limit) customers = await connection.query("SELECT * FROM customers;")

    res.send(customers.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getCustomer(req, res) {
  const { id } = req.params;

  if (isNaN(id)) return res.sendStatus(400);

  try {
    const customer = await connection.query(
      `SELECT * FROM customers WHERE id=$1;`,
      [id]
    );
    if (!customer.rows[0]) return res.sendStatus(404);
    res.status(200).send(customer.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function editCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
  
    if (isNaN(id)) return res.sendStatus(400);
  
    try {
      const cpfExists = await connection.query(
        "SELECT * FROM customers WHERE cpf=$1 AND id <> $2",
        [cpf, id]
      );
  
      if (cpfExists.rows[0]) return res.sendStatus(409);
  
      await connection.query(
        "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
        [name, phone, cpf, birthday, id]
      );
  
      res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

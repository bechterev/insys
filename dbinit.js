const { Client } = require("pg");

let client = new Client({
  host: "localhost",
  user: "postgres",
  password: "noV2021",
  database: "insys",
  port: 5435,
});
client.connect();
let queryCRUD = {
  create: "INSERT INTO users ",
  read: "SELECT * FROM users where id=$1 ",
  update: "UPDATE users SET ",
  delete: "DELETE from users where id=$1",
};
let querySearch = {
  all: "SELECT * FROM users limit 10 offset $1",
  search: "SELECT * FROM users where ", // id like '%$1%' or fio like '%$1% or gender like '%$1%' or birthday like '%$1%'
};

const transactQuery = async (user, query) => {
  try {
    await client.query("BEGIN");
    let data = await client.query(query, user);
    await client.query("COMMIT");
    return data;
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    throw e;
  }
};

const opSwitch = async (data, op, id) => {
  if (op == "update") {
    let values = Object.values(data);
    let fields = Object.keys(data);
    console.log(
      values,
      queryCRUD.update +
        fields
          .map((el, ind) => {
            return ` ${el}=$${ind + 1} `;
          })
          .join("") +
        ` where id=${id} `
    );
    return await transactQuery(
      values,
      queryCRUD.update +
        fields
          .map((el, ind) => {
            return ` ${el}=$${ind + 1} `;
          })
          .join("") +
        ` where id=${id} `
    );
  } else if (op == "create") {
    let values = Object.values(data);
    let fields = Object.keys(data);
    return await transactQuery(
      values,
      queryCRUD[op] +
        `(${fields.join(",")}) values (${values.map(
          (el, ind) => "$" + (ind + 1)
        )})`
    );
  } else if (op == "read") {
    let result = await transactQuery(data, queryCRUD[op]);
    return result;
  } else if (op == "delete") {
    let result = await transactQuery(data, queryCRUD[op]);
    if (result.rowCount < 1) throw "user no found";
    return result;
  } else if (op == "all") {
    return await transactQuery((data = [id]), querySearch[op]);
  } else if (op == "search") {
    let values = Object.values(data);
    let fields = Object.keys(data);
    return await transactQuery(
      values,
      querySearch[op] +
        fields.map((el, ind) => {
          return ` ${el} = $${ind + 1} `;
        })
    );
  }
};

module.exports = {
  opSwitch,
};

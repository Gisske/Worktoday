const knex = require("knex")({
    client: "mysql",
    connection: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "stdactivity_25677",
    },
  });

  module.exports = knex; 
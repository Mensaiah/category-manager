// eslint-disable-next-line @typescript-eslint/no-var-requires
const  dotenv = require("dotenv");
dotenv.config();


module.exports =  {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: "postgres",
    omitNull: true,
    logging: false,

  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: "postgres",
    omitNull: true,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    omitNull: true,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  staging: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    omitNull: true,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

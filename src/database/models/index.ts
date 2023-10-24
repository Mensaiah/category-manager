import fs from "fs";
import path from "path";
import { DataTypes, Sequelize } from "sequelize";
import config from "../config";


const db: any = {};
const env = process.env.NODE_ENV as string
const sequelize: any = new Sequelize(config[env].url as string, config[env] as any);

const extension = process.env.NODE_ENV === "production"  ||  process.env.NODE_ENV === "staging" ? ".js" : ".ts";

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === extension
  )
  .forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);


    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const resolvedConnection = () => console.log("Connected to database!");

const rejectedConnection = (error: Error) =>
  console.log(`Failed to connect to. Error: ${error.message}`);

sequelize.authenticate().then(resolvedConnection).catch(rejectedConnection);

export default db;

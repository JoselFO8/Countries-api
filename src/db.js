require('dotenv').config();
const { Sequelize, Op } = require('sequelize'); 
const fs = require('fs');
const path = require('path');
const { DB_URI_POSTGRESQL } = process.env;

const sequelize = new Sequelize(DB_URI_POSTGRESQL, {
  logging: false,
  native: false,
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false
  //   }
  // },
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models 
const { Country, TouristActivity } = sequelize.models;

// ------------------- Aca vendrian las relaciones ------------------- //

// Product.hasMany(Reviews);
Country.belongsToMany(TouristActivity, {through: 'CountryTouristActivity'});
TouristActivity.belongsToMany(Country, {through: 'CountryTouristActivity'});

module.exports = {
  ...sequelize.models,
  conn: sequelize,
  Op
  
};



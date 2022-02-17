require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/ecommerce`, {

  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models/Product_Mangement"))
	.filter(file => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
	.forEach(file => {
		modelDefiners.push(require(path.join(__dirname, "/models/Product_Mangement", file)));
	});

fs.readdirSync(path.join(__dirname, "/models/User_Management"))
	.filter(file => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
	.forEach(file => {
		modelDefiners.push(require(path.join(__dirname, "/models/User_Management", file)));
	});

fs.readdirSync(path.join(__dirname, "/models/Shopping_Session"))
	.filter(file => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
	.forEach(file => {
		modelDefiners.push(require(path.join(__dirname, "/models/Shopping_Session", file)));
	});

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(entry => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { 

	Discount, 
	ProductCategory, 
	ProductInventory, 
	Product, 

	UserAddress, 
	UserPayment, 
	User,
	UserReviews,

	CartItems,
	OrderDetails,
	OrderItems,
	PaymentDetails,
	ShoppingSession

 } = sequelize.models;


//User relations
User.hasMany(UserAddress)
User.hasMany(UserPayment)
User.hasMany(UserReviews)

//Product relations
ProductInventory.hasOne(Product)
ProductCategory.belongsToMany(Product, {through: 'product_Categories'})
Product.belongsToMany(ProductCategory, {through: 'product_Categories'})
Discount.hasMany(Product)

//Shopping relations
OrderDetails.belongsTo(PaymentDetails)
OrderDetails.hasMany(OrderItems)
ShoppingSession.hasMany(CartItems)

//Mixed relations
OrderItems.belongsTo(Product)
CartItems.belongsTo(Product)
OrderDetails.belongsTo(User)
ShoppingSession.belongsTo(User)
Product.hasMany(UserReviews)


module.exports = {
	...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
	conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};

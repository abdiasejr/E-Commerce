require('dotenv').config()
const axios = require('axios');
const { filter } = require('bluebird');
const { Op } = require("sequelize");

const {Discount, ProductCategory, ProductInventory, Product, OrderDetails, OrderItems} = require ('../../db.js')


const getOrderStatus = async (req, res)=> {
    try {
        const status = await OrderDetails.findAll({
            attributes : ['status']
        })
        res.status(200).send(status)
    } catch (err) {
        console.log(err)
        res.status(404).send(err)
        
    }
}

const filterOrderByStatus = async (req, res) => {
    try {
        const {status} = req.params;
        const filteredOrders = await OrderDetails.findAll({
            where: { status: status }
        });
        res.json(filteredOrders)
    } catch(err) {
        console.log(err);
        res.status(404).send(err)
    }
}

const changeOrderStatus = async (req, res) => {
    try {
        const {orderId, status} = req.body;
        const order = await  OrderDetails.findByPk(orderId);
        order.status = status;
        await order.save();
        res.send('Order updated')
    } catch(err) {
        console.log(err);
        res.status(404).send(err)
    }
}

const getInfoProducts = async () =>{
    let search = await Product.findAll({
        include:
        {
            model: ProductCategory,
            attributes: ['name'],
            through: {
                attributes: [],
            },
        }
    })
    return search
}

const getOrders = async (req, res) => {
    try{    
    let orders = await OrderItems.findAll()
  res.status(200).send(orders)
    } 
    catch(err) {
        console.log(err)
        res.status(404).send(err)
    }
 }

const getOrderId = async (req, res) => {
    try{
    const {id} = req.params;
     if(id){
         const orders = await OrderDetails.findAll()
         const orderFiltered = orders.filter(e => e.id == id)
         res.status(200).send(orderFiltered)
     }
    } 
    catch(err){
        console.log(err)
        res.status(404).send(err)
    }
 }

const getInfoCategory = async () =>{
    let search = await ProductCategory.findAll()
    return search
}

const getCategory = async (req, res) =>{
    let search = await getInfoCategory()
    let categories = search.map(x => ({
        name: x.name,
        description: x.description,
        id: x.id
    }))

    res.status(200).send(categories)
}

const createCategory = async (req, res) =>{
    let {name, description} = req.body

    let createdCategory = await ProductCategory.create({
        name,
        description
    })
    res.json(createdCategory)
}

const addCategoryToProduct = async (req, res) =>{
    let {
        id,
        category
    } = req.body

    let categoryDb = await ProductCategory.findAll({
        where: {name: category}
    })

    let product = await Product.findOne({
        where: {id: id}
    })

    product.addProductCategory(categoryDb)

    res.json({product, msg: "added category to product"})
}

const removeCategoryFromProduct = async (req, res) =>{
    let {
        id,
        category
    } = req.body

    let categoryDb = await ProductCategory.findAll({
        where: {name: category}
    })

    let product = await Product.findOne({
        where: {id: id}
    })

    product.removeProductCategory(categoryDb)

    res.json({product, msg: "removed category to product"})
}


const getAllProducts = async (req, res) =>{
    let search = await getInfoProducts()

    let allProducts = []
    for(let product of search){

        let inventory = await ProductInventory.findOne(
            {
                where: {id: product.inventory_id}
            }
        )
        allProducts.push({
            id: product.id,
            name: product.name,
            description: product.description,
            SKU: product.SKU,
            price: product.price,
            category: product.productCategories.map(x => x.name),
            quantity: inventory.quantity
        })
    }

    res.status(200).send(allProducts)
}

const createProduct = async (req, res) => {

    let {
        name,
        description,
        SKU,
        price,
        category,
        quantity
    } = req.body
    try{

        
        let createdInventory = await ProductInventory.create({
            quantity
        })
        
        let createdProduct = await Product.create({
            name,
            description,
        SKU,
        price,
        category,
        inventory_id: createdInventory.id
    })

		let categoryDb = await ProductCategory.findAll({
            where: { name: category },
		});
		createdProduct.addProductCategory(categoryDb[0].dataValues.id);
        
		return res.status(201).send("Product created");
        
	} catch (error) {
		console.log(error);
	}
};


const editProduct = async (req, res, next) => {
	const id = req.query.id;
	let { name, description, price } = req.body;

	try {
		await Product.update({ name, description, price }, { where: { id: id } });

		let productUpdated = await Product.findOne({
			where: {
				id: id,
			},
		});
		return res.json({ productUpdated, msg: "product updated" });
	} catch (error) {
		next(error);
	}
};
const allStatus = async (req, res) => {
    const status = await OrderDetails.findAll({
        attributes: ['status']
    })
        res.send(status)
}

const addToInvetory = async(req, res) => {
    let {
        quantity,
        id
    } = req.body

    let product = await ProductInventory.findOne({
        where: {id: id}
    })


    await product.increment('quantity', {by: quantity})    

    res.json({msg: "increased inventory", product})
}

const removeFromInvetory = async(req, res) => {
    let {
        quantity,
        id
    } = req.body

    let product = await ProductInventory.findOne({
        where: {id: id}
    })

    await product.decrement('quantity', {by: quantity})    

    res.json({msg: "decreased inventory", product})
}




const createAdmin = async (req, res) =>{
    let {
        id
    } = req.body

    User.update(
        {
            isAdmin: true
        },
        {where: { id: id}}
    )

    let updatedUser = await User.findOne({
        where: {id: id}
    })

    res.json({updatedUser, msg: "User changed to admin"})
}

const searchProductName = async (req, res) => {
	const { name } = req.query;
	if (!name) {
		return res.status(404).send("Invalid name");
	}
	try {
        let productsByName = await Product.findAll({
            where: {
				name: {
					[Op.iLike]: "%" + name + "%",
				},
			},
            include:
            {
                model: ProductCategory,
                attributes: ['name'],
                through: {
                    attributes: [],
                },
            }
        })
        let finalres = [];
        for(let product of productsByName){
            let inventory = await ProductInventory.findOne(
                {
                    where: {id: product.inventory_id}
                }
            )
            finalres.push({
                id: product.id,
                name: product.name,
                description: product.description,
                SKU: product.SKU,
                price: product.price,
                category: product.productCategories.map(x => x.name),
                quantity: inventory.quantity
            })
        }
		res.json(finalres);
	} catch (err) {
		console.log(err);
		res.status(404).send(err);
	}
};

const searchCategoryName = async function (req, res) {
    const { name } = req.query;
	if (!name) {
		return res.status(404).send("Invalid name");
	}
	try {
        let categoriesByName = await ProductCategory.findAll({
            where: {
				name: {
					[Op.iLike]: "%" + name + "%",
				},
			},
        })
        let finalres = categoriesByName.map(x => ({
            name: x.name,
            description: x.description,
            id: x.id
        }))
        res.json(finalres);
	} catch (err) {
		console.log(err);
		res.status(404).send(err);
	}
}

module.exports = {
    searchCategoryName,
    searchProductName,
    getAllProducts,
    createProduct, 
    editProduct, 
    getCategory, 
    createCategory,
    addCategoryToProduct,
    removeCategoryFromProduct, 
    getOrderId, 
    getOrderStatus, 
    getOrders,
    allStatus,
    filterOrderByStatus,
    changeOrderStatus,
    createAdmin,
    addToInvetory,
    removeFromInvetory,
    allStatus
};

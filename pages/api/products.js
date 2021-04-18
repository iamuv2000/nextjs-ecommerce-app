import initDB from '../../helpers/initDB';
import Product from '../../models/Product';

initDB();

export default async (req, res) => {
	
	switch(req.method) {
		case 'GET' :
			await getAllProducts(req,res);
			break;
		case 'POST':
			await saveProduct(req,res);
			break;

	}
}

const getAllProducts = async ( req, res ) => {
	console.log("Request for products received")
	Product.find().then((products) => {
		res.status(200).send(products)
	})
}

const saveProduct = async (req,res) => {
	try{
		console.log("Creating product...")
		const {name,price,description,mediaUrl} = req.body;
		if(!name || !price || !description || !mediaUrl){
			res.status(422).json({
				error: "Please fill all the fields"
			})
			return;
		}
		const product = await new Product({name,price,description,mediaUrl}).save();
		res.status(201).json(product)
	} catch (e) {
		console.log(e.message)
		res.status(500).json({
			error: e.message
		})
		return;
	}
	
}


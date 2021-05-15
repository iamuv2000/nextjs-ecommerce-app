import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import Authenticated from '../../helpers/Authenticated';
import initDB from '../../helpers/initDB';

initDB();

export default async (req,res) => {
	switch(req.method) {
		case 'GET' : 
				await fetchUserCart(req,res); 
				break;
		case 'PUT' : await addProduct(req,res);
				break;
		case 'DELETE' : await removeProduct(req,res);
					break;

	}
	

}



// Fetch user cart
const fetchUserCart = Authenticated(async (req,res) => {
	try{
		console.log("Fetching cart items....")
		const cart = await Cart.findOne({user : req.userId}).populate("products.product");
		console.log(cart);
		res.status(200).json(cart);
	} catch (e) {
		console.log(e.message);
	}

})

// Add product to cart
const addProduct = Authenticated(async (req,res) => {
	console.log("Adding product to cart...")
	const {quantity , productId} = req.body;
	const cart = await Cart.findOne({user: req.userId});
	const pExists = cart.products.some(pdoc => productId === pdoc.product.toString());
	if(pExists) {
		console.log("Product exists in cart, incrementing quantity....")
		await Cart.findOneAndUpdate(
			{_id: cart._id, "products.product" : productId},
			{$inc : {"products.$.quantity" : quantity}}
		)
	} else {
		console.log("Product does not exist in cart, adding....")
		const newProduct = {quantity, product: productId};
		await Cart.findOneAndUpdate(
			{_id: cart._id},
			{$push : {products: newProduct}}
		)
	}
	console.log("Product added to cart")
	res.status(200).json({"message" : "Product added to cart"});
})

// Remove product from care
const removeProduct = Authenticated(async (req,res) => {
	console.log("Removing product from cart...")
	const {productId} = req.body;
	let cart = await Cart.findOneAndUpdate(
		{user:req.userId},
		{$pull : {products:{product:productId}}},
		{new:true}
	).populate("products.product");
	res.status(200).json(cart);
	console.log("Removed product from cart")
})
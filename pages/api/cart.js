import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';

export default async (req,res) => {
	switch(req.method) {
		case 'GET' : 
				await fetchUserCart(req,res); 
				break;
		case 'PUT' : await addProduct(req,res);
				break;
	}
	

}


function Authenticated(icomponent) {
	return (req,res)=>{
		const {authorization}  = req.headers;
		if(!authorization) {
			return res.status(401).json({error: "You must login"})
		}
		try {
			const {userId} = jwt.verify(authorization , process.env.JWT_SECRET);
			req.userId = userId
			return icomponent(req,res)
		} catch (e) {
			console.log(e.message)
		}
	}
}

// Fetch user cart
const fetchUserCart = Authenticated(async (req,res) => {
	const cart = await Cart.findOne({user: req.userId});
	res.status(200).json({
		products: cart.products
	})
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
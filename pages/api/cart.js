import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';

export default async (req,res) => {
	const {authorization}  = req.headers;
	if(!authorization) {
		return res.status(401).json({error: "You must login"})
	}

	try{
		const {userId} = jwt.verify(authorization , process.env.JWT_SECRET);
		const cart = await Cart.findOne({user: userId});

		res.status(200).json({
			products: cart.products
		})
	} catch (e) {
		console.log(e.message);
		return res.status(401).json({error: "You must login"})
	} 


}
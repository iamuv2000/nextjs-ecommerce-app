import Product from '../../../models/Product';

export default async (req, res) => {
	console.log("Sending product details...")
	const {pid} = req.query
	const product = await Product.findOne({_id:pid});
	res.status(200).json(product)
}

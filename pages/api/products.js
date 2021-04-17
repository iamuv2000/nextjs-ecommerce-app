import initDB from '../../helpers/initDB';
import Product from '../../models/Product';

initDB();

export default (req, res) => {
	console.log("Request for products received")
	Product.find().then((products) => {
		res.status(200).send(products)
	})
}

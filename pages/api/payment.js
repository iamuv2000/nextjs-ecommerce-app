import Stripe from 'stripe';
import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import Order from '../../models/Order';
const stripe = Stripe("sk_test_51HoAekHdUE2Cpr9nb3RQTIwTtmL0z12GPdQkignSCMqSC6Bt2ykit3OnWEZoRdtRPvgbfQW6MKCU0BhHC9cb9vhv004yqLhLh1");

export default async (req, res) => {
	const {paymentInfo} = req.body;
	const {authorization}  = req.headers;
	if(!authorization) {
		return res.status(401).json({error: "You must login"})
	}
	try {
		console.log("Processing payment...")
		const {userId} = jwt.verify(authorization , process.env.JWT_SECRET);
		const cart = await Cart.findOne({user : userId}).populate("products.product");

		// Calculating cart price
		let price = 0;
		cart.products.forEach((item) => {
			price = price + (item.quantity * item.product.price);
		});

		console.log("Paying: INR " + price);
		const prevCustomer = await stripe.customers.list({email : paymentInfo.email});

		const isExistingCustomer = prevCustomer.data.length > 0;

		let newCustomer;
		if(!isExistingCustomer) {
			console.log("Creating new customer");
			newCustomer =  await stripe.customers.create({
				email : paymentInfo.email,
				source : paymentInfo.id
			});
		}

		const charge = await stripe.charges.create(
			{
				currency: "INR",
				amount: price*100,
				receipt_email:  paymentInfo.email,
				customer : isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
				description : `You made a payment of INR ${price*100}`
			}, {
				idempotencyKey: uuidv4()
			}
		);

		await new Order({
			user: userId,
			email: paymentInfo.email,
			total: price,
			products: cart.products
		}).save()

		await Cart.findOneAndUpdate(
			{_id: cart._id},
			{$set : {products: []}}
		)

		
		
		res.status(200).json({message: "Payment was successful!"})

	} catch (e) {
		console.log(e.message)
		return res.status(401).json({error: "An error occured while processing payment!"})
	}

}
import initDB from '../../helpers/initDB';
import User from '../../models/User';
import Cart from '../../models/Cart';
import bcrypt from 'bcryptjs';

initDB();

export default async (req,res) => {
	try{
		const {name, email, password} = req.body;
		if(!name || !email || !password) {
			return res.status(422).json({
				"error" : "Please fill all fields"
			});
		}

		const user = await User.findOne({email});
		if(user) {
			console.log("User already exists!")
			return res.status(422).json({
				"error" : "User already exists with the email"
			});
		}

		const hasedPassword = await bcrypt.hash(password , 12);

		// CREATE USER
		const newUser = await new User({
			name,
			email,
			password: hasedPassword
		}).save()

		// CREATE CART
		await new Cart({
			user : newUser._id
		}).save();

		console.log(newUser);

		return res.status(201).json({
			msg: "Signup successful"
		})

	} catch (e) {
		res.status(500).json({
			"error" : "Internal server error"
		})
		console.log(e.message)
	}
}
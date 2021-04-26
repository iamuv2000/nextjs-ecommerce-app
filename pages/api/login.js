import initDB from '../../helpers/initDB';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

initDB();

export default async (req,res) => {
	try{
		console.log("Logging in...")
		const { email, password} = req.body;
		if(!email || !password) {
			console.log("Please fill all fields")
			return res.status(422).json({
				"error" : "Please fill all fields"
			});
		}

		const user = await User.findOne({email});
		if(!user) {
			console.log("User not found exists!")
			return res.status(404).json({
				"error" : "Email or password don't match"
			});
		}

		if(await bcrypt.compare(password , user.password)) {
			
			const token = jwt.sign({userId : user._id} , process.env.JWT_SECRET , {
				expiresIn:"7d"
			})

			const {name, role, email} = user;

			return res.status(201).json({
				msg: "Login successful",
				token,
				user: {name,role,email}
			})
		} else {
			return res.status(401).json({
				error: "Email or password don't match"
			})
		}

		

	} catch (e) {
		res.status(500).json({
			"error" : "Internal server error"
		})
		console.log(e.message)
	}
}
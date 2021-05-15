

import jwt from 'jsonwebtoken';

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

export default Authenticated
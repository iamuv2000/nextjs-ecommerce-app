import Link from 'next/link';
import { useState } from 'react';
import baseURL from '../helpers/baseURL';
import {useRouter} from 'next/router'

const Signup = () => {

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const userSignup = async (e) => {
		e.preventDefault();
		try{
			let response = await fetch(`${baseURL}/api/signup`, {
				method : 'POST',
				headers: {
					'Content-Type' : 'application/json'
				},
				body: JSON.stringify({
					name,email,password
				})
			})
	
			const data = await response.json();
			console.log(data);
			if(data.error) {
				M.toast({html: data.error, classes: 'red'})
	
			}
			else {
				M.toast({html: data.msg, classes: 'green'});
				router.push('/login');
			}
		} catch (e) {
			M.toast({html: e.message, classes: 'red'})
		}
		
	}

	return (
		<div className='container center-align authCard card'>
			<h3>Signup </h3>
			<form onSubmit={(e) => userSignup(e)}>
				<input type='text' placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
				<input type='email' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button className="btn waves-effect waves-light #1565c0 blue darken-3" type="submit">Signup
   				<i className="material-icons right">forward</i>
				</button>
			</form>
			<Link href='/login'><a><h5>Already have an account?</h5></a></Link>
		</div>
	)
}

export default Signup;
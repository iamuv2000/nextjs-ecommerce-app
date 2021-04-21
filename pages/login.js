import Link from 'next/link';
import { useState } from 'react';
import baseURL from '../helpers/baseURL';
import cookie from 'js-cookie';
import {useRouter} from 'next/router'
 

const Login = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const router = useRouter();


	const userLogin = async (e) => {
		e.preventDefault();
		const response = await fetch(`${baseURL}/api/login` , {
			method : 'POST',
			headers:{
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify({
				email, password
			})
		})

		const data = await response.json();
		if(data.error) {
			M.toast({html: data.error, classes: 'red'});
		} else {
			cookie.set('token' , data.token)
			cookie.set('user' , data.user)
			router.push('/account');
		}
	}

	return (
		<div className='container center-align authCard card'>
			<h3>Login </h3>
			<form onSubmit={(e) => userLogin(e)}>
				<input type='email' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button className="btn waves-effect waves-light #1565c0 blue darken-3" type="submit">Login
   				<i className="material-icons right">forward</i>
				</button>
			</form>
			<Link href='/signup'><a><h5>Don't have an account?</h5></a></Link>

		</div>
	)
}

export default Login;
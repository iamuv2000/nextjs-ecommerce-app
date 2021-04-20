import Link from 'next/link';
import { useState } from 'react';

const Login = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');


	return (
		<div className='container center-align authCard card'>
			<h3>Login </h3>
			<form>
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
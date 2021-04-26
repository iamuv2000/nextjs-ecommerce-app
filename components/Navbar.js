import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies'
import cookie from 'js-cookie';

const NavBar = () => {

	const router = useRouter();
	const { token } = parseCookies();
	const cookies = parseCookies();
	const user = cookies.user ? JSON.parse(cookies.user) : ''

	const isActive = (route) => {
		if (route === router.pathname) {
			return 'active';
		}
	}

	const logout = () => {
		cookie.remove('token');
		cookie.remove('user');
		router.push('/login');
	}

	return (
		<nav>
			<div className="nav-wrapper #1565c0 blue darken-3">
				<Link href="/">
					<a className="brand-logo left">MyStore</a>
				</Link>
				<ul id="nav-mobile" className="right">
					{user.role !== 'user' && <li className={isActive('/create')}>
						<Link href="/create">
							<a>Create</a>
						</Link>
					</li>}
					<li>
						<Link href="/cart">
							<a>Cart</a>
						</Link>
					</li>
					{
						user
							?
							<>
								<li className={isActive('/login')}>
									<Link href="/login">
										<a>Account</a>
									</Link>
								</li>
								<li className={isActive('/signup')}>
									<button className='btn red' onClick={()=>logout()}>
										Logout
									</button>
								</li>
							</>
							:
							<>
								<li className={isActive('/login')}>
									<Link href="/login">
										<a>Login</a>
									</Link>
								</li>
								<li className={isActive('/signup')}>
									<Link href="/signup">
										<a>Signup</a>
									</Link>
								</li>
							</>

					}
				</ul>
			</div>
		</nav >
	)
}
export default NavBar;

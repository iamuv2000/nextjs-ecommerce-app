import { parseCookies } from "nookies";
import baseURL from '../helpers/baseURL';
import cookie from 'js-cookie';
import {useRouter}  from 'next/router';

const Cart = ({error}) => {

	const router = useRouter();

	if(error) {
		M.toast({html:error , classes: "red"});
		cookie.remove('user');
		cookie.remove('token');
		router.push('/login');
	}

	return (
		<h1>
			CART
		</h1>
	)
}


export const getServerSideProps = async (ctx) => {
	const {token} = parseCookies(ctx)
	
	if(!token) {
		return {
            props:{error: "Please login to continue"}
        }
	} 

	const response = await fetch(`${baseURL}/api/cart` , {
		headers : {
			'Content-Type' : "appliation/json",
			"Authorization" : token
		}
	});

	const cart = await response.json();
	console.log(cart.products);
	if(cart.error) {
		return {
			props: {
				error: cart.error
			}
		}
	}
	return {
		props: {
			products: cart.products
		}
	}
}

export default Cart;
import { parseCookies } from "nookies";
import baseURL from '../helpers/baseURL';
import cookie from 'js-cookie';
import {useRouter}  from 'next/router';
import Link from 'next/link';
import {useState} from 'react';
import StripeCheckout from 'react-stripe-checkout';

const Cart = ({error, products}) => {
	console.log(products)
	const {token} = parseCookies();
	const router = useRouter();

	const [cartProduct , setCartProduct] = useState(products);
	let price = 0;

	if(!token) {
		return(
			<div className = "center-align">
				Please login to view cart
				<Link href='/login'><a>Login</a></Link>
			</div>
		)
	}

	if(error) {
		M.toast({html:error , classes: "red"});
		cookie.remove('user');
		cookie.remove('token');
		router.push('/login');
	}

	const handleRemove = async (productId) => {
		console.log("Deleting product from cart");
		let response = await fetch(`${baseURL}/api/cart` , {
			method: 'DELETE', 
			headers: {
				'Content-Type' : "application/json",
				'Authorization'  : token
			},
			body: JSON.stringify({
				productId
			})
		})

		let data = await response.json();
		console.log(data);
		setCartProduct(data.products)
	}

	const CartItems = () => {
		return(
			<>
				{cartProduct.map((item) => {
					price = price + (item.quantity * item.product.price);
					return (
					<div style={{"display" : "flex" , margin: "20px"}}>
						<img src={item.product.mediaUrl} style={{"width":"30%"}}/>
						<div style={{"marginLeft" : "20px"}}>
							<h6>{item.product.name}</h6>
							<h6>{item.quantity} X {item.product.price}</h6>
							<button className="btn red" onClick={()=>handleRemove(item.product._id)}>Remove</button>
						</div>
					</div>)
				})}
			</>
		)
	}

	const handleCheckout = async (paymentInfo) => {
		try{
			console.log(paymentInfo);

			let response = await fetch(`${baseURL}/api/payment` ,  {
				method: 'POST',
				headers: {
					'Content-Type' : 'application/json',
					'Authorization' : token
				},
				body: JSON.stringify({
					paymentInfo
				})
			})
	
			let data = await response.json();
			console.log(data);
		} catch (e) {
			console.log(e.message);
		}
		
	}

	const TotalPrice = () => {
		return (
			<div className="container" style={{"display" : "flex" , "justifyContent" : "space-between"}}> 
				<h5>Total: ₹ {price}</h5>
				<StripeCheckout
					name = "MyStore"
					amount = {price*100}
					image = {products.length > 0 ? products[0].product.mediaUrl : ""}
					currency = 'INR'
					shippingAddress = {true}
					billingAddress = {true}
					zipCode = {true}
					stripeKey = "pk_test_51HoAekHdUE2Cpr9n7NFlL272l0yJoJyaxkE7MkXdJhPrszupUPEINNaEoGPgke81oVXQDBcwVWjtlQcatjVJ9S5g00PmRjBS89"
					token = {(paymentInfo)=>handleCheckout(paymentInfo)}
				>
					<button className="btn">Checkout</button>
				</StripeCheckout>
				
			</div>
		)
	}

	return (
		<div className="container">
			<CartItems />
			<TotalPrice />
		</div>
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
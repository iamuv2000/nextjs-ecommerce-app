import { parseCookies } from "nookies";
import {useEffect,useRef} from 'react'
import baseURL from '../helpers/baseURL';

const Account = ({orders}) => {
	const orderCard = useRef(null)
	const cookie = parseCookies();
	const user = cookie.user ? JSON.parse(cookie.user) : "";
	console.log("Orders are...");

	useEffect(()=>{
        M.Collapsible.init(orderCard.current)
    },[])

	const OrderHistory = ()=>{
        return(
            <ul className="collapsible" ref={orderCard}>

                {orders.map(item=>{
                    return(
                     <li key={item._id}>
                        <div className="collapsible-header"><i className="material-icons">folder</i>{item.createdAt}</div>
                        <div className="collapsible-body">
                            <h5>Total  ₹ {item.total}</h5>
                            {
                                item.products.map(pitem=>{
                                  return <h6 key={pitem._id}>{pitem.product.name} X {pitem.quantity}</h6>  
                                })
                            }
                
                        </div>
                    </li>   
                    )
                })}
                    
                
           </ul>
        
        )
  }

	return(
		<div className = "container">
			<div className = "center-align">
				<h4>{user.name}</h4>
				<h4>{user.email}</h4>
				<h3>Order History</h3>
					{
					orders.length == 0?
					<div className="container">
							<h5>Your have no order History</h5>
						</div>
					:<OrderHistory />
					}
			</div>
		</div>
	)

}


export const getServerSideProps = async (ctx) => {
	const {token} = parseCookies(ctx)
	if(!token) {
		const {res} = ctx;
		res.writeHead(302, {Location : '/login'});
		res.end();
	}

	const response = await fetch(`${baseURL}/api/orders` , {
		headers: {
			"Authorization" : token
		}
	})
	let orders = await response.json();

	return {
		props: {
			orders
		}
	}
}

export default Account;
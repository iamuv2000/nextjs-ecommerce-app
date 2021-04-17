
import Link from 'next/link';
import { useRouter } from 'next/router'
import baseURL from '../../helpers/baseURL';
import {useRef , useEffect} from 'react';

const Product = ({ product }) => {

	const router = useRouter();
	const modalRef = useRef(null);


	useEffect(() => {
		M.Modal.init(modalRef.current)
	}, [])

	if (router.isFallback) {
		return (
			<h3>Loading...</h3>
		)
	}

	const getModal = () => {
		return (
			<div id="modal1" className="modal" ref={modalRef}>
				<div className="modal-content">
					<h4>{product.name}</h4>
					<p>Are you sure you want to delete this?</p>
				</div>
				
				<div className="modal-footer">
				<button data-target="modal1" className="btn modal-trigger waves-effect waves-light #1565c0 blue darken-3">Cancel
				</button>
					<button  className="btn waves-effect waves-light #c62828 red darken-3" onClick={()=>deleteProduct()}>Yes
					</button>
				</div>
			</div>
		)
	}

	const deleteProduct = async () => {
		const res = await fetch(`${baseURL}/api/product/${product._id}` , {
			method: 'DELETE'
		});
		const data = await res.json();
		router.push('/')
	}

	return (
		<div className='container center-align'>
			<h3>{product.name}</h3>
			<img src={product.mediaUrl} width='30%' />
			<input type='number' style={{
				width: '400px',
				margin: '10px'
			}}
				min="1"
				placeholder='Quantity'
			/>
			<button className="btn waves-effect waves-light #1565c0 blue darken-3">Add
    			<i className="material-icons right">add</i>
			</button>

			<h5>₹ {product.price}</h5>
			<p className='left-align'>
				{product.description}
			</p>
			<button data-target="modal1" className="btn modal-trigger waves-effect waves-light #c62828 red darken-3">Delete
    			<i className="material-icons left">delete</i>
			</button>
			{getModal()}
		</div>
	)
}

export const getServerSideProps = async ({ params }) => {
	const res = await fetch(`${baseURL}/api/product/${params.pid}`);
	const data = await res.json();
	return {
		props: {
			product: data
		}
	}
}


// export const getStaticProps = async ({params}) => {
// 	const res = await fetch('http://localhost:3000/api/product/'+params.pid); 
// 	const data = await res.json();
// 	return {
// 		props:{
// 			product: data
// 		}
// 	}
// }

// export const getStaticPath = async () => {
// 	return {
// 		paths : [
// 			{
// 				params : {

// 				}
// 			}
// 		],
// 		fallback: true
// 	}
// }

export default Product;
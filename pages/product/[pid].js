
import Link from 'next/link';
import {useRouter} from 'next/router'


const Product = ({product}) => {
	
	const router =  useRouter();
	if(router.isFallback){
		return (
			<h3>Loading...</h3>
		)
	}

	return(
		<div>
			<h1>{product.name}</h1>
		</div>
	)
}

export const getServerSideProps = async ({params}) => {
	const res = await fetch('http://localhost:3000/api/product/'+params.pid); 
	const data = await res.json();
	return {
		props:{
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
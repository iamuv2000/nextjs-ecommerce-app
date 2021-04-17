import Link from 'next/link';



const Home = ({products}) => {
	
	const productList = products.map((product) => {
		return (
			<div className="card" key={product._id}>
				<div className="card-image">
					<img src={product.mediaUrl}/>
					<span className="card-title black-text">{product.name}</span>
				</div>
				<div className="card-content">
					<p>{product.price}</p>
				</div>
				<div className="card-action">
					<Link href={'/product/[pid]'} as={`/product/${product._id}`}>
						<a>View Product</a>
					</Link>
				</div>
      		</div>
		)
	})

	return(
		<div className='rootCard'>
			{productList}
		</div>
	)
}

export const getStaticProps = async () => {
	const res = await fetch('http://localhost:3000/api/products'); 
	const data = await res.json();
	console.log(data)
	return {
		props:{
			products: data
		}
	}
}

export default Home;
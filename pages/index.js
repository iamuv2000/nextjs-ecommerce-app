import Link from 'next/link';

const Home = (props) => {
	return(
		<div>
			<h1>NextJS is awesome</h1>
			<Link href='/product'>
				<a>Go to product</a>
			</Link>
		</div>
	)
}


export default Home;
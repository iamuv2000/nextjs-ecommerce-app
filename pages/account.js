import { parseCookies } from "nookies";

const Account = () => {

	return(
		<h3>
			Account
		</h3>
	)

}


export const getServerSideProps = (ctx) => {
	const {token} = parseCookies()
	if(!token) {
		const {res} = ctx;
		res.writeHead(302, {Location : '/login'});
		res.end();
	}

	return {
		props: {
			
		}
	}
}

export default Account;
import Link from 'next/link';
import {useState} from 'react';
import baseURL from '../helpers/baseURL';

const CreatePage = () => {

	const [name , setName] = useState('');
	const [price , setPrice] = useState('');
	const [media , setMedia] = useState('');
	const [description , setDescription] = useState('');
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch(`${baseURL}/api/products` , {
			'method': 'POST',
			'headers' : {
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({
				name,
				price,
				mediaUrl: media,
				description
			})
		})
		const data = await res.json();
		if(data.error) {
			M.toast({html: data.error, classes: 'red'})
		} else {
			M.toast({html: 'Product created', classes: 'green'})
		}
	}

	return(
		<form className='container' onSubmit={(e)=>handleSubmit(e)}>
			<input type='text' name='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
			<input type='text' name='price' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)}/>
			<input type='text' name='mediaURL' placeholder='Image URL' value={media} onChange={(e) => setMedia(e.target.value)}/>
			<img className='responsive' src={media} height='400px'/>
			<textarea name='description' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} className="materialize-textarea"></textarea>
			<button className="btn waves-effect waves-light" type="submit">Submit
   				<i className="material-icons right">send</i>
  			</button>
        
		</form>
	)
}

export default CreatePage;
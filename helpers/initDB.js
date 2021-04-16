import mongooose, { mongo } from 'mongoose';

const initDB = () => {
	if(mongooose.connections[0].readyState){
		console.log("Already connected");
		return;
	}
	mongooose.connect(process.env.MONGO_URI , {
		useNewUrlParser: true,
		useUnifiedTopology: true

	})
	mongooose.connection.on('connected' , () => {
		console.log("Connected to mongo");
	})
	mongooose.connection.on('error' , (e) => {
		console.log("Failed to connect to mongo");
		console.log(e.message);
	})
}

export default initDB;
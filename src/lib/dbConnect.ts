import mongoose from "mongoose"



type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}


async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Alredy connected to database")
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected = db.connections[0].readyState  //it returna a number but i t can differ depends on database
        console.log("Db connected succesfully")
    }
    catch (err) {
        console.log("Database connection failed", err)
        process.exit(1)
    }
}

export default dbConnect;
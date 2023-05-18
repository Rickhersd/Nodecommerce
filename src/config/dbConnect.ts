import mongoose from "mongoose"

const dbConnect = () => {
    try{
        console.log(process.env.MONGO_URI) 
    
        const conn = mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.${process.env.MONGO_URI}/?retryWrites=true&w=majority`)
        console.log("database Connected Successfully")
    } catch(error ){
        console.log("database error")
    }
}

module.exports=dbConnect;
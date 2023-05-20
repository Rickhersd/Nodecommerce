import mongoose from "mongoose";

const validateMongoDbId = (id:string) =>{
    const isValid:boolean = mongoose.Types.ObjectId.isValid(id)
    if(!isValid) throw new Error('this id not valid or not found')
}

export default validateMongoDbId
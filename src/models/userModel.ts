import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default: "user"
    },
    cart:{
        type: Array,
        default: []
    },
    isBlocke:{
        type:Boolean, 
        default: false
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address"}],
    wishList: [{ type:  mongoose.Schema.Types.ObjectId, ref: "Product"}], 
    refreshToken: {
        type: String
    }
},{
    timestamps: true
});

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.isPasswordMatched = async function(enteredPassworld: string | Buffer){
    console.log(await bcrypt.compare(enteredPassworld, this.password))
    return await bcrypt.compare(enteredPassworld, this.password)
}

export default mongoose.model('User', userSchema);
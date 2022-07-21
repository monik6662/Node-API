const mongoose =require("mongoose")

const ProductsSchema= new mongoose.Schema({
    name:String,
    price:String,
    brand:String,
    category:String,
    userId:String


   
})
module.exports=   mongoose.model("products",ProductsSchema)
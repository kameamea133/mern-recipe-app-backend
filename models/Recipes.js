const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
   },
   category: { 
    type: String, 
    required: true,
    enum: ['starter', 'dish', 'dessert'], // Ajoute les options de catégories
   },
   ingredients: [{ type: String, required: true}],
   instructions: { type: String, required: true},
   imageUrl: { type: String, required: true},
   cookingTime: { type: Number, required: true},
   userOwner: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true},
})

const RecipeModel = mongoose.model("recipes", RecipeSchema);
module.exports =  RecipeModel;
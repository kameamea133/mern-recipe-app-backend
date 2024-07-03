var express = require('express');
var router = express.Router();
const RecipeModel = require('../models/Recipes');
const UserModel = require('../models/Users');

router.get('/', async (req, res) => {
    try{
        const response = await RecipeModel.find({});
        res.json(response)
    }catch(err) {
        res.json(err)
    }
})


router.post('/', async (req, res) => {
    const recipe = new RecipeModel(req.body)
    try{
        const response = await recipe.save();
        res.json(response)
    }catch(err) {
        res.json(err)
    }
})

router.put('/', async (req, res) => {
    try{
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID)
        user.SavedRecipes.push(recipe);
        await user.save()
        res.json({ savedRecipes: user.savedRecipes})
    }catch(err) {
        res.json(err)
    }
})

router.get("/savedRecipes/ids", async (req, res) => {
    try{
        const user = await UserModel.findById(req.body.userID);
        res.json({ savedRecipes: user?.SavedRecipes})
    }catch(err) {
        res.json(err)
    }
})

router.get("/savedRecipes", async (req, res) => {
    try{
        const user = await UserModel.findById(req.body.userID);
        const savedRecipes = await RecipeModel.find({
            _id: { $in: user.savedRecipes}
        })
        res.json({ savedRecipes })
    }catch(err) {
        res.json(err)
    }
})



module.exports = router;
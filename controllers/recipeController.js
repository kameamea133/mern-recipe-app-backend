// controllers/recipeController.js

const RecipeModel = require('../models/Recipes');
const UserModel = require('../models/Users');

const getAllRecipes = async (req, res) => {
    try {
        const response = await RecipeModel.find({}).populate();
        res.json(response);
    } catch (err) {
        res.json(err);
    }
};

const createRecipe = async (req, res) => {
    const recipe = new RecipeModel(req.body);
    try {
        const response = await recipe.save();
        res.json(response);
    } catch (err) {
        res.json(err);
    }
};

const saveRecipe = async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe);
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
        res.json(err);
    }
};

const getSavedRecipesIds = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user?.savedRecipes });
    } catch (err) {
        res.json(err);
    }
};

const getSavedRecipes = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({
            _id: { $in: user.savedRecipes },
        });
        res.json({ savedRecipes });
    } catch (err) {
        res.json(err);
    }
};

const deleteRecipe = async (req, res) => {
    const { recipeID } = req.params;
    const { userID } = req.body;

    try {
        const user = await UserModel.findById(userID);
        user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeID);
        await user.save();
        res.json({ message: "Recipe deleted successfully!", savedRecipes: user.savedRecipes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




const getRecipesByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const recipes = await RecipeModel.aggregate([
            { $match: { category: category } }
        ]);
        res.json(recipes);
    } catch (err) {
        res.json(err);
    }
};

const searchRecipes = async (req, res) => {
    const { query } = req.params;
    try {
        const recipes = await RecipeModel.aggregate([
            {
                $match: {
                    name: { $regex: query, $options: 'i' }
                }
            }
        ]);
        res.json(recipes);
    } catch (err) {
        res.json(err);
    }
};

const getUserRecipes = async (req, res) => {
    try {
        const recipes = await RecipeModel.find({ userOwner: req.params.userID });
        res.json(recipes);
    } catch (err) {
        res.json(err);
    }
};


const getRecipeById = async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.params.id);
        res.json(recipe);
    } catch (err) {
        res.json(err);
    }
};

const updateRecipeById = async (req, res) => {
    try {
        const updatedRecipe = await RecipeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



module.exports = {
    getAllRecipes,
    createRecipe,
    saveRecipe,
    getSavedRecipesIds,
    getSavedRecipes,
    deleteRecipe,
    getRecipesByCategory,
    searchRecipes,
    getUserRecipes,
    getRecipeById,
    updateRecipeById,
};

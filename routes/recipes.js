var express = require('express');
var router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
    getAllRecipes,
    createRecipe,
    saveRecipe,
    getSavedRecipesIds,
    getSavedRecipes,
    deleteRecipe,
    getRecipesByCategory,
    searchRecipes,

} = require('../controllers/recipeController');

router.get('/', getAllRecipes);
router.post('/', verifyToken, createRecipe);
router.put('/', verifyToken, saveRecipe);
router.get('/savedRecipes/ids/:userID', getSavedRecipesIds);
router.get('/savedRecipes/:userID', getSavedRecipes);
router.delete('/:recipeID', verifyToken, deleteRecipe);

// Routes for categories
router.get('/category/starter', (req, res) => getRecipesByCategory({ params: { category: 'starter' } }, res));
router.get('/category/dish', (req, res) => getRecipesByCategory({ params: { category: 'dish' } }, res));
router.get('/category/dessert', (req, res) => getRecipesByCategory({ params: { category: 'dessert' } }, res));

// Route pour la recherche
router.get('/search/:query', searchRecipes);


module.exports = router;

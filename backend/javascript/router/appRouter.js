const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// import the rest of the controllers for each model
const {
  checkUser,
  updateCommunitySaved,
  updateApiSaved,
  getCommunitySaved,
  addMealsPlanned,
} = require("../controllers/userController");
const {
  uploadRecipe,
  getRecipes,
  getRecipesByName,
  getRecipesByUser,
  updateRecipe,
  getHottestRecipes,
  deleteRecipe,
} = require("../controllers/recipeController");

router = express.Router();

// User routes
router.post("/check-user", checkUser);
router.post("/update-saved-community", updateCommunitySaved);
router.post("/update-saved-api", updateApiSaved);
router.post("/add-meals-planned", addMealsPlanned);
router.post("/get-community-saved", getCommunitySaved);

// Recipe routes
router.get("/get-recipes", getRecipes);
router.get("/get-hottest-recipes", getHottestRecipes);
router.get("/get-recipes-by-name", getRecipesByName);
router.get("/get-recipes-by-user", getRecipesByUser);
router.post("/upload-recipe", upload.single("recipeImage"), uploadRecipe);
router.post("/update-recipe", updateRecipe);
router.post("/delete-recipe", deleteRecipe);
// configure api endpoints for each function (controller)

module.exports = router;

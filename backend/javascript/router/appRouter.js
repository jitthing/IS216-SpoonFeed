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
  getMealsPlanned,
  getWeeklyPlan,
  updateWeeklyPlan,
  deleteMealsPlanned,
  updateMealLog,
  getMealHistory,
  getUserCount,
} = require("../controllers/userController");
const {
  uploadRecipe,
  getRecipes,
  getRecipesByName,
  getRecipesByUser,
  getRecipeById,
  updateRecipe,
  editRecipe,
  getHottestRecipes,
  deleteRecipe,
} = require("../controllers/recipeController");

router = express.Router();

// User routes
router.get("/get-user-count", getUserCount);
router.post("/check-user", checkUser);
router.post("/update-saved-community", updateCommunitySaved);
router.post("/update-saved-api", updateApiSaved);
router.post("/add-meals-planned", addMealsPlanned);
router.post("/delete-meals-planned", deleteMealsPlanned);
router.post("/get-meals-planned", getMealsPlanned);
router.post("/get-community-saved", getCommunitySaved);
router.post("/get-weekly-plan", getWeeklyPlan);
router.post("/update-weekly-plan", updateWeeklyPlan);
router.post("/update-meal-log", updateMealLog);
router.post("/get-meal-history", getMealHistory);
// Recipe routes
router.get("/get-recipes", getRecipes);
router.get("/get-hottest-recipes", getHottestRecipes);
router.get("/get-recipes-by-name", getRecipesByName);
router.get("/get-recipes-by-user", getRecipesByUser);
router.post("/upload-recipe", upload.single("recipeImage"), uploadRecipe);
router.post("/update-recipe", updateRecipe);
router.post("/delete-recipe", deleteRecipe);
router.post("/get-recipe-by-id", getRecipeById);
router.post("/edit-recipe", editRecipe);
// configure api endpoints for each function (controller)

module.exports = router;

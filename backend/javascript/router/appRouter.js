const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// import the rest of the controllers for each model
const { checkUser, updateSaved } = require("../controllers/userController");
const {
  uploadRecipe,
  getRecipes,
  getRecipesByName,
  getRecipesByUser,
  updateRecipe,
} = require("../controllers/recipeController");

router = express.Router();

// User routes
router.post("/check-user", checkUser);
router.post("/update-saved", updateSaved);

// Recipe routes
router.get("/get-recipes", getRecipes);
router.get("/get-recipes-by-name", getRecipesByName);
router.get("/get-recipes-by-user", getRecipesByUser);
router.post("/upload-recipe", upload.single("recipeImage"), uploadRecipe);
router.post("/update-recipe", updateRecipe);

// configure api endpoints for each function (controller)

module.exports = router;

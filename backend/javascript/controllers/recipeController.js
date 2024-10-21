const firebase = require("../firebase.js");

async function getRecipes(req, res) {
  const db = firebase.db;
  const recipesRef = db.ref("recipes");
  const snapshot = await recipesRef.once("value");
  const recipes = snapshot.val();
  if (recipes) {
    return res.status(200).json({ message: "Recipes found", recipes });
  }
  return res.status(404).json({ message: "No recipes found" });
}

async function getRecipesByName(req, res) {
  const searchText = req.body.searchText;
  const words = searchText.split(" ");
  let result = [];
  const db = firebase.db;
  const recipesRef = db.ref("recipes");
  const snapshot = await recipesRef.once("value");
  const recipes = snapshot.val();
  if (recipes) {
    for (const key in recipes) {
      const recipe = recipes[key];
      for (const word of words) {
        if (recipe.name.includes(word)) {
          if (!result.includes(recipe)) {
            result.push(recipe);
          }
        }
      }
    }
  }
  if (result) {
    return res.status(200).json({ message: "Recipes found", result });
  }
  return res.status(404).json({ message: "No recipes found" });
}

async function getRecipesByUser(req, res) {
  const id = req.body.id;
  const db = firebase.db;
  const recipesRef = db.ref("recipes");
  const snapshot = await recipesRef
    .orderByChild("author")
    .equalTo(id)
    .once("value");
  const recipes = snapshot.val();
  if (recipes) {
    return res.status(200).json({ message: "User Recipes found", recipes });
  }
  return res.status(404).json({ message: "No user recipes found" });
}

async function uploadRecipe(req, res) {
  const recipeData = JSON.parse(req.body.recipeData);
  const file = req.file;
  const { recipeName, recipeAuthor, recipeIngredients, recipeInstructions } =
    recipeData;
  var publicUrl = "";

  if (!recipeName || !recipeIngredients || !recipeInstructions || !file) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const uniqueFileName = `${recipeName}-${Date.now()}`;
    const bucket = firebase.bucket;

    // console.log(bucket.name);

    const fileUpload = bucket.file(`images/${uniqueFileName}`);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // the error is somewhere here
    blobStream.on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).json({ message: "File upload error", error: err });
    });
    blobStream.on("finish", async () => {
      // Get public URL of the file
      publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

      const db = firebase.db;

      const recipeRef = db.ref("recipes").push();
      await recipeRef.set({
        name: recipeName,
        author: recipeAuthor,
        ingredients: recipeIngredients,
        instructions: recipeInstructions,
        imageUrl: publicUrl,
      });

      res
        .status(200)
        .json({ message: "Recipe uploaded successfully", publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

module.exports = {
  uploadRecipe,
  getRecipes,
  getRecipesByName,
  getRecipesByUser,
};

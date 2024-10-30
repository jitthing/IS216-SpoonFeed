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

async function getHottestRecipes(req, res) {
  const db = firebase.db;
  const recipesRef = db.ref("recipes");
  try {
    // Order by numSaves in descending order and limit to 5 results
    const snapshot = await recipesRef
      .orderByChild("numSaves")
      .limitToLast(5)
      .once("value");

    // Convert the snapshot to array and reverse it (to get descending order)
    const recipes = [];
    snapshot.forEach((childSnapshot) => {
      recipes.unshift(childSnapshot.val()); // unshift to reverse the order
    });

    if (recipes.length > 0) {
      return res
        .status(200)
        .json({ message: "Hottest Recipes found", recipes });
    }
    return res.status(404).json({ message: "No hottest recipes found" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching hottest recipes", error });
  }
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
  const {
    recipeName,
    recipeAuthorId,
    recipeAuthor,
    recipeIngredients,
    recipeInstructions,
  } = recipeData;

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
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(fileUpload.name)}?alt=media`;

      const db = firebase.db;

      const recipeRef = db.ref("recipes").push();
      await recipeRef.set({
        id: recipeRef.key,
        name: recipeName,
        author: recipeAuthor,
        authorId: recipeAuthorId,
        ingredients: recipeIngredients,
        instructions: recipeInstructions,
        imageUrl: publicUrl,
        numSaves: 0,
        comments: [],
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

async function updateRecipe(req, res) {
  const { comments, recipeId, saved } = req.body;
  if (comments) {
    try {
      const db = firebase.db;
      const recipeRef = db.ref(`recipes/${recipeId}`);
      await recipeRef.update({ comments: comments });
      return res.status(200).json({ message: "Recipe updated successfully" });
    } catch (e) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  } else if (saved !== undefined) {
    {
      try {
        const db = firebase.db;
        const recipeRef = db.ref(`recipes/${recipeId}`);
        const snapshot = await recipeRef.once("value");
        const recipe = snapshot.val();
        const numSaves = recipe.numSaves || 0;
        if (saved) {
          await recipeRef.update({ numSaves: numSaves + 1 });
          return res.status(200).json({ message: "Recipe saved successfully" });
        } else {
          await recipeRef.update({ numSaves: numSaves - 1 });
          return res
            .status(200)
            .json({ message: "Recipe unsaved successfully" });
        }
      } catch (e) {
        return res.status(500).json({ message: "Something wrong", e });
      }
    }
  }
}

module.exports = {
  uploadRecipe,
  getRecipes,
  getRecipesByName,
  getRecipesByUser,
  updateRecipe,
  getHottestRecipes,
};

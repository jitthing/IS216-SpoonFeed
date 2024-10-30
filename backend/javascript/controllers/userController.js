const firebase = require("../firebase.js");

async function checkUser(req, res) {
  const { userId, firstName } = req.body;
  // console.log(userId);
  try {
    const userRef = firebase.db.ref(`users/${userId}`);
    const snapshot = await userRef.once("value");
    const userData = snapshot.val();

    if (userData) {
      return res.status(200).json({ message: "User found", userData });
    } else {
      // insert user
      await userRef.set({ id: userId, name: firstName });
      return res.status(201).json({ message: "User created", userId });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal servor error", error });
  }
}

async function updateCommunitySaved(req, res) {
  const { userId, recipeId, saved } = req.body;
  try {
    const userRef = firebase.db.ref(`users/${userId}`);
    const snapshot = await userRef.once("value");
    const userData = snapshot.val();

    if (userData) {
      const savedRecipes = userData.CommunitySaved || [];
      if (saved) {
        savedRecipes.push(recipeId);
      } else {
        const index = savedRecipes.indexOf(recipeId);
        if (index > -1) {
          savedRecipes.splice(index, 1);
        }
      }
      await userRef.update({ CommunitySaved: savedRecipes });
      return res.status(200).json({ message: "Saved updated" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal servor error", error });
  }
}

async function updateApiSaved(req, res) {
  const { userId, recipeId } = req.body;
  try {
    const userRef = firebase.db.ref(`users/${userId}`);
    const snapshot = await userRef.once("value");
    const userData = snapshot.val();

    if (userData) {
      const savedRecipes = userData.ApiSaved || [];
      if (!savedRecipes.includes(recipeId)) {
        savedRecipes.push(recipeId);
      } else {
        const index = savedRecipes.indexOf(recipeId);
        if (index > -1) {
          savedRecipes.splice(index, 1);
        }
      }
      await userRef.update({ ApiSaved: savedRecipes });
      return res.status(200).json({ message: "Saved updated" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal servor error", error });
  }
}

async function getCommunitySaved(req, res) {
  const { recipeIds } = req.body;
  const db = firebase.db;
  const recipesRef = db.ref("recipes");
  
  try {
    const snapshot = await recipesRef.once("value");
    const recipes = snapshot.val();
    const result = [];
    
    if (recipes) {
      for (const key in recipes) {
        if (recipeIds.includes(key)) {
          result.push({
            ...recipes[key],
            id: key
          });
        }
      }
      
      return res.status(200).json({
        message: "Recipes found",
        recipes: result
      });
    }
    
    return res.status(200).json({
      message: "No recipes found",
      recipes: []
    });
  } catch (error) {
    console.error('Error fetching community recipes:', error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

module.exports = {
  checkUser,
  updateCommunitySaved,
  updateApiSaved,
  getCommunitySaved,
};

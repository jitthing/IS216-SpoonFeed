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
      const freshWeeklyPlan = {
        Monday: { breakfast: [], lunch: [], dinner: [] },
        Tuesday: { breakfast: [], lunch: [], dinner: [] },
        Wednesday: { breakfast: [], lunch: [], dinner: [] },
        Thursday: { breakfast: [], lunch: [], dinner: [] },
        Friday: { breakfast: [], lunch: [], dinner: [] },
        Saturday: { breakfast: [], lunch: [], dinner: [] },
        Sunday: { breakfast: [], lunch: [], dinner: [] },
      };
      await userRef.set({
        id: userId,
        name: firstName,
        WeeklyPlan: freshWeeklyPlan,
      });
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
      const saved = savedRecipes.includes(recipeId);
      if (!saved) {
        savedRecipes.push(recipeId);
      } else {
        const index = savedRecipes.indexOf(recipeId);
        if (index > -1) {
          savedRecipes.splice(index, 1);
        }
      }
      await userRef.update({ ApiSaved: savedRecipes });
      return res
        .status(200)
        .json({ message: "Saved updated", wasSaved: saved });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal servor error", error });
  }
}

async function addMealsPlanned(req, res) {
  const { userId, recipeId, type } = req.body;
  const userRef = firebase.db.ref(`users/${userId}`);
  const snapshot = await userRef.once("value");
  const userData = snapshot.val();

  if (userData) {
    const mealsPlanned = userData.MealsPlanned || [];
    mealsPlanned.push({ recipeId, type });
    await userRef.update({ MealsPlanned: mealsPlanned });
    return res.status(200).json({ message: "Meals planned updated" });
  } else {
    return res.status(404).json({ message: "User not found" });
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
            id: key,
          });
        }
      }

      return res.status(200).json({
        message: "Recipes found",
        recipes: result,
      });
    }

    return res.status(200).json({
      message: "No recipes found",
      recipes: [],
    });
  } catch (error) {
    console.error("Error fetching community recipes:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getMealsPlanned(req, res) {
  const userId = req.body.userId;
  const userRef = firebase.db.ref(`users/${userId}`);
  const snapshot = await userRef.once("value");
  const userData = snapshot.val();

  if (!userData) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    message: "Succesfully fetched Meals planned",
    mealsPlanned: userData.MealsPlanned ?? [],
  });
}

async function getWeeklyPlan(req, res) {
  const { userId } = req.body;
  const userRef = firebase.db.ref(`users/${userId}`);
  const snapshot = await userRef.once("value");
  const userData = snapshot.val();
  if (userData) {
    if (userData.WeeklyPlan) {
      return res.status(200).json({
        message: "Weekly plan found",
        weeklyPlan: userData.WeeklyPlan,
      });
    } else {
      const freshWeeklyPlan = {
        Monday: { breakfast: [], lunch: [], dinner: [] },
        Tuesday: { breakfast: [], lunch: [], dinner: [] },
        Wednesday: { breakfast: [], lunch: [], dinner: [] },
        Thursday: { breakfast: [], lunch: [], dinner: [] },
        Friday: { breakfast: [], lunch: [], dinner: [] },
        Saturday: { breakfast: [], lunch: [], dinner: [] },
        Sunday: { breakfast: [], lunch: [], dinner: [] },
      };
      await userRef.update({ WeeklyPlan: freshWeeklyPlan });
      return res.status(200).json({
        message: "Weekly plan created",
        weeklyPlan: freshWeeklyPlan,
      });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
}

async function updateWeeklyPlan(req, res) {
  try {
    const { userId, weeklyPlan } = req.body;
    const userRef = firebase.db.ref(`users/${userId}`);
    await userRef.update({ WeeklyPlan: weeklyPlan });

    return res.status(200).json({ message: "Weekly plan updated" });
  } catch (error) {
    console.error("Error updating weekly plan:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}
module.exports = {
  checkUser,
  updateCommunitySaved,
  updateApiSaved,
  getCommunitySaved,
  addMealsPlanned,
  getMealsPlanned,
  getWeeklyPlan,
  updateWeeklyPlan,
};

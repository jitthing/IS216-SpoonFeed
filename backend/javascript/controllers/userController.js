const firebase = require("../firebase.js");

async function checkUser(req, res) {
  const { userId, firstName } = req.body;
  console.log(userId);
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

module.exports = { checkUser };

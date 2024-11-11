## Welcome to SpoonFeed!

SpoonFeed is a recipe management and discovery web application that helps users find, create, and organize recipes. Built with Vue.js and Node.js, it provides a seamless experience for home cooks to explore new dishes and maintain their recipe collections.

### Features

- **Recipe Creation**: Create and share your own recipes with detailed ingredients, instructions, preparation time, and nutritional information
- **Recipe Search**: Search for recipes using ingredients or recipe names
- **Recipe Collections**: Organize recipes into custom boards like "Pastries" or "Recipes to Make"
- **Nutritional Information**: Automatically calculate macronutrient information for recipes
- **Meal Planning**: Plan your meals for the week and add them to your calendar
- **User Authentication**: Secure user accounts and authentication powered by Clerk
- **Image Upload**: Add photos to your recipes to make them more appealing
- **Edit & Delete**: Full control to modify or remove your recipes and collections

### Tech Stack

**Frontend:**

- Vue.js 3 with Composition API
- Vue Router for navigation
- Bootstrap for styling
- Clerk for authentication

**Backend:**

- Node.js
- Express.js
- Firebase for data storage
- Spoonacular API for recipe data
- API Ninja for additional recipe information

## Production Link

[SpoonFeed](https://spoonfeed-mauve.vercel.app/)

### SETUP

Before starting, ensure you have installed node.js on your local machine.

1. Clone the repository in your favourite IDE and enter the repository's directory

```
git clone https://github.com/jitthing/IS216-SpoonFeed.git
```

```
cd IS216-SpoonFeed
```

### BACKEND

2. Enter the backend/javascript directory and install the necessary dependencies.
   Make sure you have node.js installed on your machine, and the following .env file in the javascript folder with the following variables:

```

FIREBASE_TYPE=***
FIREBASE_PROJECT_ID=***
FIREBASE_PRIVATE_KEY_ID=***
FIREBASE_PRIVATE_KEY=***
FIREBASE_CLIENT_EMAIL=***
FIREBASE_CLIENT_ID=***
FIREBASE_AUTH_URI=***
FIREBASE_TOKEN_URI=***
FIREBASE_AUTH_PROVIDER_CERT_URL=***
FIREBASE_CLIENT_CERT_URL=***
FIREBASE_UNIVERSE_DOMAIN=***
FIREBASE_DB_URL=***
FIREBASE_STORAGE_BUCKET=***
```

```
cd backend/javascript
```

```
npm install
```

3. Start the backend server in development environment

```
npm run devStart
```

### FRONTEND

4. Enter the frontend directory and install the necessary dependencies. Make sure you have the following variables in your .env file located in the frontend directory

```
VITE_CLERK_PUBLISHABLE_KEY=***
VITE_APP_SPOONACULAR_KEY=***
VITE_APP_API_NINJA_KEY=***
VITE_APP_BACKEND_URL=YOUR_BACKEND_SERVER_URL
```

```
cd frontend
```

```
npm i
```

```
npm run dev
```

4. In the frontend directory, start frontend in development environment

Ensure you have the following variables in your .env file located in the frontend directory

```
VITE_CLERK_PUBLISHABLE_KEY=***
VITE_APP_SPOONACULAR_KEY=***
```

```
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) or the url provided by your terminal to view it in your browser.
   The page will reload when you make changes.

7. Happy cooking!

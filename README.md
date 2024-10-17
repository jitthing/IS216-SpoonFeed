## Welcome to SpoonFeed!

Before starting, ensure you have installed node.js on your local machine.

1. Clone the repository in your favourite IDE and enter the repository's directory

```
git clone https://github.com/jitthing/wad2_project.git
```

```
cd wad2_project
```

2. Enter the frontend directory and install the necessary dependencies

```
cd frontend
```

```
npm install
```

3. Enter the backend directory and pip install the necessary dependencies

```
cd backend
```

```
pip install -r requirements.txt
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

5. In the backend directory, run backend in development environment

For Javascript:

```
npm i
npm run devStart
```

For Python:

```
python app.py
```

6. Open [http://localhost:5173](http://localhost:5173) or the url provided by your terminal to view it in your browser.
   The page will reload when you make changes.
   You may also see any lint errors in the console.

7. Happy cooking!

Marvel API Backend

This project is a backend service built with Node.js and Express that interacts with the Marvel API to retrieve comics, characters, and manage user data such as favorites. The backend provides several endpoints to handle user authentication and fetch data from the Marvel API, with caching and error handling.

🚀 Features

User authentication and token-based authorization

Fetching comics and characters from the Marvel API

Adding and retrieving user favorites (comics and characters)

Pagination and search filters

Caching API responses for better performance

Secure password storage using hashing (with bcrypt)

📂 Project Structure

project-root/
├── routes/
│   ├── user.js        # User-related routes
│   ├── comics.js      # Comics-related routes
│   └── characters.js  # Characters-related routes
├── utils/
│   ├── fetchMarvelAPI.js  # Utility to fetch data from the Marvel API with caching
│   └── generateMarvelURL.js  # Utility to generate the Marvel API URL
├── tests/
│   └── test_comics_routes.js  # Unit tests for the comics routes
├── .env              # Environment variables
├── index.js          # Main entry point of the application
└── README.md         # Project documentation

🛠️ Technologies Used

Node.js: JavaScript runtime

Express: Web framework for Node.js

MongoDB: Database for storing user data

Axios: HTTP client for making requests to the Marvel API

NodeCache: In-memory caching solution

Jest: Testing framework

Supertest: HTTP assertions library for testing Express applications

📋 Environment Variables

Create a .env file in the root of your project and add the following variables:

PORT=3000
MONGO_URI=your_mongodb_connection_string
MARVEL_API_PUBLIC_KEY=your_marvel_public_key
MARVEL_API_PRIVATE_KEY=your_marvel_private_key
MARVEL_BASE_URL=https://gateway.marvel.com/v1/public

📖 API Endpoints

User Routes

POST /user/signup: Create a new user

POST /user/login: Log in a user and return a token

GET /user/favorites: Retrieve the list of user favorites (protected route)

POST /user/favorites: Add a favorite item (protected route)

Comics Routes

GET /comics: Get a list of comics with pagination and search filters

GET /comics/:id: Get details of a specific comic by ID

Characters Routes

GET /characters: Get a list of characters with pagination and search filters

GET /characters/:id: Get details of a specific character by ID

🧪 Running Unit Tests

To run the unit tests, use the following command:

npm test

You can also run a specific test file:

npx jest path/to/test_comics_routes.js

🚀 Running the Application

Install dependencies:

npm install

Start the server:

npm start

The application will run on http://localhost:3000

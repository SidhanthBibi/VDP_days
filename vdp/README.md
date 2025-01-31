# College Club Management and Advertising Website

This project is a full-stack application designed for managing and advertising college clubs. It allows users to log in using their college email addresses, view multiple clubs, and access individual club pages.

## Project Structure

```
college-club-management
├── client                # Client-side application
│   ├── public
│   │   └── index.html    # Main HTML file for the client application
│   ├── src
│   │   ├── App.jsx       # Main component of the React application
│   │   ├── main.jsx      # Entry point for the React application
│   │   ├── components     # Folder for React components
│   │   │   ├── Club.jsx           # Component representing a single club
│   │   │   ├── ClubList.jsx       # Component displaying a list of clubs
│   │   │   ├── Login.jsx          # Component providing a login form
│   │   │   └── Navbar.jsx         # Navigation bar component
│   │   ├── pages
│   │   │   ├── Home.jsx           # Home page component
│   │   │   ├── ClubPage.jsx       # Detailed view of a specific club
│   │   │   └── NotFound.jsx       # 404 error page
│   │   └── styles
│   │       └── main.css           # Main styles for the client application
│   ├── package.json      # Client-side dependencies and scripts
│   └── vite.config.js    # Vite configuration for the client
├── server                # Server-side application
│   ├── src
│   │   ├── app.js        # Entry point for the Express server
│   │   ├── controllers    # Folder for controller functions
│   │   │   ├── authController.js  # Authentication logic
│   │   │   ├── clubController.js  # Club management logic
│   │   │   └── userController.js  # User management logic
│   │   ├── models         # Folder for Mongoose models
│   │   │   ├── clubModel.js       # Mongoose schema for clubs
│   │   │   └── userModel.js       # Mongoose schema for users
│   │   ├── routes         # Folder for route definitions
│   │   │   ├── authRoutes.js       # Authentication routes
│   │   │   ├── clubRoutes.js       # Club routes
│   │   │   └── userRoutes.js       # User routes
│   │   └── index.js      # Initializes the server
│   ├── package.json      # Server-side dependencies and scripts
│   └── .env              # Environment variables
├── package.json          # Overall project configuration
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (running locally or a cloud instance)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd college-club-management
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd client
   npm install
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm start
   ```

2. Start the client:
   ```
   cd client
   npm run dev
   ```

### Usage

- The client application will be available at `http://localhost:3000`.
- The server will be running on `http://localhost:5000`.

## Contributing

Feel free to submit issues or pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
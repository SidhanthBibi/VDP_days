# College Club Management System

## Project Structure

 vdp/ <br>
###### ├── client/                 # Frontend React application
###### │   ├── public/             # Static files
###### │   │   └── index.html      # Main HTML file
###### │   ├── src/                # Source files
###### │   │   ├── components/     # Reusable React components
###### │   │   │   └── Club.jsx    # Club component
###### │   │   ├── pages/          # Page components
###### │   │   │   └── ClubPage.jsx# Club page component
###### │   │   ├── App.js          # Main application component
###### │   │   ├── index.js        # Entry point
###### │   │   └── App.css         # CSS styles
###### │   ├── package.json        # Frontend dependencies
###### │   └── README.md           # Frontend README
###### │
###### └── server/                 # Backend Node.js application
######     ├── src/                # Source files
######     │   ├── controllers/    # Route controllers
######     │   │   └── clubController.js # Club controller
######     │   ├── models/         # Database models
######     │   │   └── clubModel.js# Club model
######     │   ├── routes/         # API routes
######     │   │   └── clubRoutes.js# Club routes
######     │   └── index.js        # Entry point
######     ├── package.json        # Backend dependencies
######     └── README.md           # Backend README

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. **Navigate to the server directory**:
   ```sh
   cd vdp/server
   ```

2. **Install server dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables: Create a .env file in the vdp/server directory with the following content:**
   ```markdown
   DATABASE_URL=mongodb://localhost:27017/college_club_management
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

### Frontend Setup
1. **Navigate to the client directory**:
   ```sh
   cd vdp/client
   ```

2. **Install client dependencies:**
   ```sh
   npm install
   ```

3. **Start the frontend application:**
   ```sh
   npm start
   ```

4. **Open your browser and navigate to:**
   ```markdown
   http://localhost:3000
   ```

## Purpose of the Website

This website is designed to help college students manage their projects, track attendance, and participate in club activities. It also includes a social platform for students to interact and share updates.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Additional Information

For more information, please contact the project maintainers at [sidhanthbibi@gmail.com](mailto:sidhanthbibi@gmail.com)

## Credits
###### @SidhanthBibi : Sidhanth Bibi
###### @Quadr1on : Adorn S George


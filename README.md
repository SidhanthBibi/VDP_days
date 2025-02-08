# College Club Management System

## Project Structure

vdp/ <br>
├── client/                 # Frontend React application <br>
│   ├── public/             # Static files <br>
│   │   └── index.html      # Main HTML file <br>
│   ├── src/                # Source files <br>
│   │   ├── components/     # Reusable React components <br>
│   │   │   └── Club.jsx    # Club component <br>
│   │   ├── pages/          # Page components <br>
│   │   │   └── ClubPage.jsx# Club page component <br>
│   │   ├── App.js          # Main application component <br>
│   │   ├── index.js        # Entry point <br>
│   │   └── App.css         # CSS styles <br>
│   ├── package.json        # Frontend dependencies <br>
│   └── README.md           # Frontend README <br>
│ <br>
└── server/                 # Backend Node.js application <br>
    ├── src/                # Source files <br>
    │   ├── controllers/    # Route controllers <br>
    │   │   └── clubController.js # Club controller <br>
    │   ├── models/         # Database models <br>
    │   │   └── clubModel.js# Club model <br>
    │   ├── routes/         # API routes <br>
    │   │   └── clubRoutes.js# Club routes <br>
    │   └── index.js        # Entry point <br>
    ├── package.json        # Backend dependencies <br>
    └── README.md           # Backend README <br>

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
###### @LennyDany-03 : Lenny Dany Derek D

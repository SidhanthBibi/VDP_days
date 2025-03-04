# College Club Management System

## Project Structure

Directory structure: <br>
└── sidhanthbibi-vdp_days/ <br>
    ├── README.md <br>
    ├── LICENSE <br>
    ├── eslint.config.js <br>
    ├── index.html <br>
    ├── package.json <br>
    ├── vercel.json <br>
    ├── vite.config.js <br>
    ├── public/ <br>
    │   └── policies/ <br>
    │       ├── contact.html <br>
    │       ├── privacy.html <br>
    │       ├── refunds.html <br>
    │       └── terms.html <br>
    └── src/ <br>
        ├── App.css <br>
        ├── App.jsx <br>
        ├── index.css <br>
        ├── main.jsx <br>
        ├── assets/ <br>
        ├── components/ <br>
        │   ├── ClubCard.jsx <br>
        │   ├── LoginSuccess.jsx <br>
        │   ├── Navbar.jsx <br>
        │   └── SignUpSuccess.jsx <br>
        ├── context/ <br>
        │   └── ClubContext.jsx <br>
        ├── lib/ <br>
        │   └── supabaseClient.js <br>
        └── pages/ <br>
            ├── About.jsx <br>
            ├── ClubDetail.jsx <br>
            ├── ClubDetailForm.jsx <br>
            ├── Clubs.jsx <br>
            ├── CodeTheDark_RegisterPage.jsx <br>
            ├── CreateNewEvent.jsx <br>
            ├── Events.jsx <br>
            ├── Explore.jsx <br>
            ├── Home.jsx <br>
            ├── Landing.jsx <br>
            ├── Login.jsx <br>
            ├── NotFound.jsx <br>
            └── SignUp.jsx <br>


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
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```markdown
   http://localhost:5173
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
###### @Mr-Jaiman09 : Arindam Jaiman

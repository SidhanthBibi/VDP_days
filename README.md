# College Club Management System

## Project Structure

Directory structure:
└── sidhanthbibi-vdp_days/
    ├── README.md
    ├── LICENSE
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── vercel.json
    ├── vite.config.js
    ├── public/
    │   └── policies/
    │       ├── contact.html
    │       ├── privacy.html
    │       ├── refunds.html
    │       └── terms.html
    └── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        ├── components/
        │   ├── ClubCard.jsx
        │   ├── LoginSuccess.jsx
        │   ├── Navbar.jsx
        │   └── SignUpSuccess.jsx
        ├── context/
        │   └── ClubContext.jsx
        ├── lib/
        │   └── supabaseClient.js
        └── pages/
            ├── About.jsx
            ├── ClubDetail.jsx
            ├── ClubDetailForm.jsx
            ├── Clubs.jsx
            ├── CodeTheDark_RegisterPage.jsx
            ├── CreateNewEvent.jsx
            ├── Events.jsx
            ├── Explore.jsx
            ├── Home.jsx
            ├── Landing.jsx
            ├── Login.jsx
            ├── NotFound.jsx
            └── SignUp.jsx


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

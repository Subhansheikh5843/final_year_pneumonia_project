# Disease Diagnosis and Chatbot Project
This project combines a Django backend for user authentication, pneumonia diagnosis from X-ray images, and a medical chatbot with a React frontend.

## Features
1. User authentication (register, login, password reset)
2. Pneumonia prediction from chest X-ray images
3. Medical chatbot for health-related queries
4. User-specific prediction history

## Getting Started
### 1. Clone the repository
```bash
git clone https://github.com/your-username/project-name.git
```
### 2. Navigate to project directory
```bash
cd project-name
```
### 3. Prerequisites
Python 3.10
Node.js (v14+ recommended)
npm

### 4. Create Virtual Environment
#### Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux/MacOS:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 5. Install Backend Dependencies
```bash
cd djangoauthapi1
pip install -r requirements.txt
```

### 6. Configure Environment Variables
Create .env file in djangoauthapi1 directory with:
```ini
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_FROM=admin-email@example.com
GOOGLE_API_KEY=your-google-api-key
```

### 7. Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 8. Start Backend Server
```bash
python manage.py runserver
```

### 9. Start Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start
```
### Project Structure
#### Backend (djangoauthapi1)
account/: User authentication (register, login, password management)
diseases/: Pneumonia prediction and chatbot functionality
media/uploads/: Stores uploaded X-ray images

#### Frontend (frontend)
React application for user interface

##### API Endpoints
1. Authentication 
POST /api/user/register/: User registration
POST /api/user/login/: User login
POST /api/user/changepassword/: Change password
POST /api/user/send-reset-password-email/: Send password reset email
POST /api/user/reset-password/<uid>/<token>/: Reset password

2. Disease Diagnosis
POST /api/disease/pneumonia/: Upload X-ray for pneumonia prediction
GET /api/disease/user-pneumonia-records/: Get user's prediction history
POST /api/disease/chatbot/: Interact with medical chatbot

#### Logs 
Logs are stored in logs/pneumonia.log


## Troubleshooting
1. Ensure Python 3.10 is installed and used
2. Verify all environment variables are properly set
3. Check that virtual environment is activated
4. Make sure required ports (8000 for backend, 3000 for frontend) are free
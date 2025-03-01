
# Entanglion Backend Server

This is a Flask backend server for the Entanglion web application that handles user authentication.

## Setup Instructions

### Prerequisites
- Python 3.6 or higher
- pip (Python package installer)

### Installation

1. Navigate to the server directory:
```
cd server
```

2. Install the required dependencies:
```
pip install -r requirements.txt
```

3. Start the Flask server:
```
python app.py
```

The server will run on http://localhost:5000 by default.

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Log in a user
- `POST /api/logout` - Log out the current user
- `GET /api/user` - Get the current logged-in user's details

## Database

The application uses SQLite for data storage. The database file `database.db` will be created automatically when you run the server for the first time.

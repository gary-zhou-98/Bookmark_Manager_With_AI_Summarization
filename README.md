# Bookmark Manager with AI Summarization

A modern web application that helps users manage their bookmarks with AI-powered summarization capabilities. Built with Next.js, Flask, and PostgreSQL.

## Features

- User authentication with JWT
- Bookmark management (add, view, delete)
- AI-powered content summarization using OpenAI's GPT-4
- Responsive dark theme UI
- Real-time updates using SWR

## Tech Stack

### Frontend

- Next.js 15.2
- React 19
- TypeScript
- Tailwind CSS
- SWR for data fetching
- Axios for API calls
- HeroIcons for icons

### Backend

- Flask
- SQLAlchemy
- PostgreSQL
- Flask-JWT-Extended
- OpenAI API
- BeautifulSoup4 for web scraping

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- PostgreSQL
- OpenAI API key

## Setup Instructions

### Database Setup

1. Install PostgreSQL
2. Create a new database:
   ```sql
   CREATE DATABASE bookmark_manager_dev;
   ```
3. (Optional) Download and install pgadmin4 and Postman to test and view database data.

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a .env file in the server directory:

   ```
   FLASK_ENV=development
   DATABASE_USER=your_db_user
   DATABASE_PASSWORD=your_db_password
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=bookmark_manager_dev
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Run database migrations:

   ```bash
   flask db upgrade
   ```

6. Start the Flask server:
   ```bash
   python run.py
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env.local file:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## AI Summarization Process

The application uses a three-step process to generate AI summaries for bookmarked URLs:

### 1. Content Extraction

The URL content is extracted using `requests` and `BeautifulSoup4`:

```python
from bs4 import BeautifulSoup
import requests

def extract_url_content(url: str) -> str:
  try:
    source = requests.get(url).text
    soup = BeautifulSoup(source, "html.parser")
    # Extract clean text content, removing scripts and styles
    text = soup.get_text("\n", strip=True)
    return text
  except Exception as e:
    print(f"Error extracting URL content: {e}")
    raise e
```

### 2. Text Processing

The extracted content is processed and chunked to handle OpenAI's token limits:

```python
def summarize_text(text: str) -> str:
  if text is None or text.strip() == "":
    return ""

  # Split text into manageable chunks
  text_chunks = text.split("\n")
  text_batch = []
  for i in range(0, len(text_chunks), 10000):
    text_batch.append("".join(text_chunks[i:i+10000]))
```

### 3. AI Summarization

The processed text is sent to OpenAI's API for summarization:

```python
  messages = []
  # System message to guide the AI's summarization
  messages.append({
    "role": "system",
    "content": "You are a helpful assistant that summarizes text scraped from a website. "
               "Please take each chunk into consideration for full context and summarize "
               "the entire text. The summarization should be precise and concise. "
               "Try to keep it at maximum 5 sentences if possible."
  })

  # Add text chunks as user messages
  for text in text_batch:
    messages.append({
      "role": "user",
      "content": text
    })

  # Signal end of chunks
  messages.append({
    "role": "user",
    "content": "[END_OF_CHUNK]"
  })

  try:
    response = client.chat.completions.create(
      model="gpt-4o-mini",
      messages=messages,
      temperature=0.3  # Lower temperature for more focused summaries
    )
    return response.choices[0].message.content.strip()
  except Exception as e:
    print(f"Error summarizing text: {e}")
    raise e
```

### Implementation Notes

1. Content Extraction:

   - Uses `requests` to fetch the webpage content
   - `BeautifulSoup4` parses HTML and extracts clean text
   - Handles various HTML structures and encodings
   - Removes scripts, styles, and other non-content elements

2. Text Processing:

   - Preserves context across chunks
   - Handles empty or invalid content gracefully

3. OpenAI Integration:

   - Uses GPT-4o-mini for high-quality summaries
   - Low temperature (0.3) for consistent, focused output
   - System prompt ensures concise, relevant summaries
   - Handles API errors and rate limits

4. Error Handling:

   - Graceful handling of network errors
   - Proper error propagation for debugging
   - Fallback behavior for failed summarizations

5. Potential Performance Improvements:
   - Asynchronous processing of summarie in background threads to avoid blocking
   - Redis to cache popular bookmarks
   - Efficient text chunking across multiple connections and summarize summaries from each chunk to avoid token limitations

## Authentication Implementation Details

### CORS Configuration

The backend uses Flask-CORS with specific configurations for local development:

1. Route-specific CORS in blueprints (e.g., auth routes):

```python
CORS(login_bp,
     resources={r"/auth/*": {"origins": ["http://localhost:3000"]}},
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
```

### JWT Authentication with Cookies

The application uses JWT tokens stored in HTTP-only cookies:

1. JWT Configuration in `server/app/__init__.py`:

```python
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False  # Set to True in production
app.config["JWT_COOKIE_SAMESITE"] = "Lax"
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600
```

2. Token refresh mechanism:

```python
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
    except (RuntimeError, KeyError):
        return response
    return response
```

### Local Development Considerations

1. Cookie Settings:

- For local development, `JWT_COOKIE_SECURE` is set to `False`
  - In production, set it to `True` for HTTPS
- For local development, `JWT_COOKIE_CSRF_PROTECT` is set to `False`
  - In production, set it to `True` for CSRF Protection

2. CORS Origins:

   - Currently set to allow `http://localhost:3000` and `http://127.0.0.1:3000` (see more info below under 5. Caveats with Cookies)
   - Update for production with your domain

3. JWT Token Configuration:

   - Tokens expire after 30 minutes
   - Automatic refresh when < 30 minutes remaining
   - Stored in HTTP-only cookies for security

4. API Error Handling:

   - Consistent error response format
   - Proper status codes
   - Detailed error messages in development

5. Caveats with Cookies in Local Development Environment:

   - Turns out, there are a lot of caveats in order to allow cookies to be set on server, send to client, received by client, and stored in browser; and there are extra things to watch out for specifically for local development:

   - Server:

     - The flask-CORS param "supports_credentials" for CORS() automatically sets allow authorization in header to true, so you don't have do it manually.
       - If you do it manually for the request in middleware or somewhere else, the value becomes "true true" instead of "true" and you will see CORS errors.
     - if Cookies' "SameSite" param (i.e. JWT_COOKIE_SAMESITE) is set as "None", then Secure param must be set to true, which implies HTTPS connection.
       - If HTTPS is not set up, then this won't work and use "Lax" instead for SameSite, which should work if you have the same localhost domain for server and client
     - The identifier param used for calling `create_access_token` function must be a string, so only passing in user.id would not work unless we cast it to string.

   - Client:

     - Most browsers _does not allow cookies to be saved_ for "localhost" domain specifically! So make sure to change your url from localhost:xxxx to 127.0.0.1:xxxx (or whatever your local ip address is)
       - Once you make this change, don't forget to also update the CORS policy to allow your ip address to access the resource on server
     - Set "withCredentials" to True in header (either directly on the Axios instance or manually configure for each request) to allow browser to send and receive Cookies

   - Tips:
     - Create @jwt.invalid_token_loader, @jwt.expired_token_loader, @jwt.unauthorized_loader functions to get detailed debug message for access_token related errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

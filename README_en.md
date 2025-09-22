# CF Clipboard

A web-based text sharing service built on Cloudflare Workers, providing simple and easy-to-use text storage and sharing functionality.

## Features

- 🚀 **High Performance**: Powered by Cloudflare Workers with global edge network deployment
- 💾 **Persistent Storage**: Uses D1 database to store text content
- ⏰ **Auto Expiration**: Supports setting expiration time, automatically deletes expired content
- 🔐 **Optional Authorization**: Supports TOKEN verification to protect data security
- 📱 **Responsive Design**: Perfectly adapts to desktop and mobile devices
- ⚡ **Real-time Editing**: Supports auto-save and real-time preview
- 🎨 **Modern UI**: Beautiful gradient design and smooth animations
- 🔒 **Password Protection**: Supports setting password protection for content to enhance security

## Deployment Instructions

### Prerequisites

- Node.js (v18+ recommended)
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account

### Deployment Steps

1. Clone the project:
   ```bash
   git clone <repository-url>
   cd cf-clipboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Login to Cloudflare:
   ```bash
   wrangler login
   ```

4. Create D1 database:
   ```bash
   npm run db:create
   ```
   Record the `database_id` from the output.

5. Update `wrangler.jsonc` configuration file:
   - Fill in the `database_id` from the previous step into the `d1_databases` configuration

6. Initialize database schema:
   ```bash
   # Production environment
   npm run db:migrate
   
   # Local development environment
   npm run db:migrate:local
   ```

7. Local development:
   ```bash
   npm run dev
   ```

8. Deploy to Cloudflare:
   ```bash
   npm run deploy
   ```

### Environment Variable Configuration

To enable TOKEN verification, uncomment and set the `TOKEN` variable in `wrangler.jsonc`:
```json
"vars": { 
  "TOKEN": "your-secret-token-here"
}
```

## API Endpoints

### 1. Read Content

#### Public Content Reading
```
GET /api/read/<key>
```
- Success: Returns text content (200) with `X-Expires-At` in response headers
- Failure: Returns 404 (key not found or expired) or 401 (unauthorized)

#### Password-protected Content Reading
```
POST /api/read/<key>
Content-Type: application/json

{
  "password": "your-password"
}
```
- Success: Returns text content (200) with `X-Expires-At` in response headers
- Failure: Returns 404 (key not found or expired) or 401 (password incorrect)

### 2. Write Content
```
POST /api/write/<key>
Content-Type: application/json

{
  "content": "text content",
  "password": "optional password",
  "expires": "expiration time"
}
```

**Expiration Time Parameters (`expires`)**:
- `1h`: Expires in 1 hour
- `12h`: Expires in 12 hours
- `1d`: Expires in 1 day
- `3d`: Expires in 3 days (default)
- `7d`: Expires in 7 days
- `never`: Never expires

**Response Format**:
```json
{
  "message": "OK",
  "expires_at": "2025-09-22T11:38:08.925Z",
  "expires_in": "86400s"
}
```

### 3. Delete Content
```
DELETE /api/delete/<key>
Content-Type: application/json

{
  "password": "optional password (if content is password-protected)"
}
```
- Success: Returns "OK" (200)
- Failure: Returns 404 (key not found) or 401 (unauthorized/password incorrect)

### 4. List All Keys
```
GET /api/list
```
Returns metadata information for all valid (non-expired) keys.

**Response Format**:
```json
{
  "total": 2,
  "items": [
    {
      "key": "my-note",
      "created_at": "2025-09-21T11:38:08.925Z",
      "updated_at": "2025-09-21T11:38:08.925Z",
      "expires_at": "2025-09-22T11:38:08.925Z",
      "password_protected": false,
      "content_length": 0
    }
  ]
}
```

### Authorization

If the environment variable `TOKEN` is set, add the following to the request header:
```
Authorization: Bearer <your-token>
```

## Web Pages

### Home Page `/`
- Enter key name and text content
- Select expiration time (1 hour - never expires)
- Supports read, write, and delete operations
- Displays expiration time and remaining time
- Provides quick operations: random key generation, link copying, etc.
- Keyboard shortcuts: Ctrl+S to save, Ctrl+R to read
- Dark/light theme switching

### Detail Page `/detail/<key>`
- Focused document editing interface
- Adjustable expiration time settings
- Displays current expiration status
- Auto-save functionality (2-second delay)
- Password protection support

## Scheduled Tasks

The system is configured with a scheduled task that performs expired content cleanup every 3 days:
```
0 0 */3 * *
```

## Technical Architecture

- **Frontend**: Native HTML/CSS/JavaScript (no framework)
- **Backend**: Cloudflare Workers + TypeScript
- **Database**: Cloudflare D1 (SQLite)
- **Build Tool**: Wrangler CLI
- **Language**: TypeScript

## Security Features

1. **Optional TOKEN Verification**: Configure access tokens via environment variables
2. **Password Protection**: Supports setting password protection for individual content
3. **HTTPS**: Automatically enabled via Cloudflare
4. **CORS Control**: Restricts cross-origin requests
5. **Input Validation**: Strict key name and content validation

## Development Commands

```bash
# Local development
npm run dev

# Deploy to Cloudflare
npm run deploy

# Create database
npm run db:create

# View database information
npm run db:info

# Initialize database schema (production environment)
npm run db:migrate

# Initialize database schema (local environment)
npm run db:migrate:local

# Query database content (production environment)
npm run db:query

# Query database content (local environment)
npm run db:query:local

# View real-time logs
npm run tail

# Check bindings
npm run check-bindings
```

## License

MIT License

## Contributing

Issues and Pull Requests are welcome!

## Support

If you find this project useful, please give it a ⭐ star!
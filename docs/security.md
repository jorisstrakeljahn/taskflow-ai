# Security Documentation

## Overview

TaskFlow AI implements multiple security measures to protect user data and prevent common web vulnerabilities.

## Input Validation and Sanitization

All user input is validated and sanitized before being processed or stored.

### Validation Functions

The application uses centralized validation utilities in `src/utils/inputValidation.ts`:

- **`validateTaskTitle`**: Validates task titles (1-200 characters)
- **`validateTaskDescription`**: Validates task descriptions (max 2000 characters)
- **`validateTaskGroup`**: Validates group names (1-50 characters)
- **`validateChatMessage`**: Validates chat messages (1-5000 characters)
- **`validateEmail`**: Validates email addresses
- **`validatePassword`**: Validates passwords (6-128 characters)

### Sanitization

The `sanitizeString` function:

- Removes null bytes and control characters
- Limits string length to prevent DoS attacks
- Trims whitespace

### Where Validation is Applied

1. **Task Creation/Editing** (`src/utils/modalHandlers.ts`):
   - All task data is validated before being saved
   - Throws errors with user-friendly messages if validation fails

2. **Chat Messages** (`src/services/openaiService.ts`):
   - Messages are validated and sanitized before being sent to OpenAI API
   - Conversation history is also sanitized
   - Existing groups are sanitized

3. **Authentication**:
   - Email and password validation in auth forms
   - Firebase Authentication handles additional server-side validation

## XSS (Cross-Site Scripting) Protection

### React's Built-in Protection

React automatically escapes all values rendered in JSX, preventing XSS attacks:

```tsx
// Safe - React escapes the value
<div>{userInput}</div>

// Never use dangerouslySetInnerHTML with user input
// ❌ DON'T DO THIS:
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Additional Measures

1. **Input Sanitization**: All user input is sanitized before storage
2. **Content Security Policy**: CSP headers restrict script execution
3. **No `dangerouslySetInnerHTML`**: The codebase does not use `dangerouslySetInnerHTML` with user input

## Content Security Policy (CSP)

CSP headers are configured in `index.html` to restrict resource loading:

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';  # Required for Vite dev mode
style-src 'self' 'unsafe-inline';                 # Required for Tailwind CSS
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://api.openai.com https://*.firebaseio.com https://*.googleapis.com;
frame-src 'self' https://*.firebaseapp.com;
```

**Note**: `unsafe-inline` and `unsafe-eval` are required for Vite's development mode. In production, consider using nonces or hashes for stricter CSP.

## Rate Limiting

### OpenAI API Rate Limiting

The chat interface implements client-side rate limiting to prevent API abuse:

- **Limit**: 20 requests per minute
- **Implementation**: Token bucket algorithm in `src/hooks/useRateLimit.ts`
- **User Feedback**: Users see a friendly error message with retry time

```tsx
const checkRateLimit = useRateLimit({
  maxRequests: 20,
  windowMs: 60000, // 1 minute
});
```

### Why Client-Side?

Client-side rate limiting provides:

- Immediate user feedback
- Cost control for API usage
- Better UX with clear error messages

**Note**: For production, consider implementing server-side rate limiting for stronger protection.

## API Key Security

### Environment Variables

API keys are stored in environment variables and never committed to version control:

- **OpenAI API Key**: `VITE_OPENAI_API_KEY` in `.env` file
- **Firebase Config**: Environment variables for Firebase credentials

### Best Practices

1. ✅ Never commit `.env` files to git
2. ✅ Use `.env.example` as a template
3. ✅ Rotate API keys regularly
4. ✅ Use different keys for development and production

## Firebase Security Rules

Firestore security rules ensure users can only access their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

See [Firebase Setup](firebase-setup.md) for complete security rules.

## Authentication Security

### Firebase Authentication

- Uses Firebase Authentication for secure user management
- Passwords are hashed and stored securely by Firebase
- Session tokens are managed by Firebase

### Password Requirements

- Minimum 6 characters (Firebase default)
- Maximum 128 characters
- Validated client-side before submission

## Data Privacy

### User Data

- All task data is user-specific (filtered by `userId`)
- No data sharing between users
- Users can delete their data at any time

### Third-Party Services

- **OpenAI**: Chat messages are sent to OpenAI API for processing
- **Firebase**: Task data is stored in Firestore
- No other third-party services receive user data

## Security Best Practices

### For Developers

1. **Always validate input** before processing
2. **Never trust client-side data** - validate on server when possible
3. **Use parameterized queries** (Firestore handles this automatically)
4. **Keep dependencies updated** - run `npm audit` regularly
5. **Review security rules** before deployment

### For Users

1. **Use strong passwords** (6+ characters, mix of letters/numbers)
2. **Don't share API keys** or credentials
3. **Log out** when using shared devices
4. **Report security issues** to the project maintainers

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do not** open a public issue
2. Email the maintainers directly
3. Provide detailed information about the vulnerability
4. Allow time for a fix before public disclosure

## Security Checklist

- [x] Input validation and sanitization
- [x] XSS protection (React escaping)
- [x] Content Security Policy headers
- [x] Rate limiting for API calls
- [x] API keys in environment variables
- [x] Firebase security rules
- [x] Authentication via Firebase
- [x] User data isolation
- [ ] Server-side rate limiting (future)
- [ ] Stricter CSP in production (future)
- [ ] Security audit (future)

## See Also

- [Firebase Setup](firebase-setup.md) - Firebase security rules
- [Development Guide](development.md) - Environment variables setup
- [API Documentation](api.md) - API usage and error handling

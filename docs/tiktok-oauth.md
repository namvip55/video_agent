# TikTok OAuth PKCE Integration

This document outlines the implementation of the TikTok OAuth flow using PKCE (Proof Key for Code Exchange) in the Auto News Video project.

## Overview

The integration provides a modular service to handle TikTok's v2 Authorization flow. It is designed to support video uploading and user information retrieval.

## Files Created/Modified

- `src/auth/tiktok.ts`: The core `TikTokAuthService` class.
- `src/auth/tiktok.test.ts`: Unit tests for the service.
- `src/config.ts`: Updated to include TikTok client credentials and redirect URI.
- `.env.example`: Updated with new environment variables.

## Configuration

Add the following to your `.env.local` file:

```env
TIKTOK_CLIENT_ID=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
TIKTOK_REDIRECT_URI=http://localhost:3000/callback
```

## Usage

### 1. Initialize the Service

```typescript
import { TikTokAuthService } from './auth/tiktok.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const authService = new TikTokAuthService(config.tiktok);
```

### 2. Generate Authorization URL (Step 1)

```typescript
// Generate PKCE pair
const { code_verifier, code_challenge } = authService.generatePKCE();

// Store code_verifier securely (e.g., in session or database)
// to use later during token exchange.

const authUrl = authService.getAuthorizationUrl(code_challenge);
console.log('Login here:', authUrl);
```

### 3. Exchange Code for Token (Step 2)

After the user redirects back to your `redirect_uri` with a `code` parameter:

```typescript
const authCode = 'code_from_url_params';
const savedVerifier = 'the_stored_code_verifier';

try {
  const tokenResponse = await authService.exchangeCodeForToken(authCode, savedVerifier);
  console.log('Access Token:', tokenResponse.access_token);
  // Save access_token and refresh_token
} catch (error) {
  console.error('Auth failed:', error.message);
}
```

## Security Details

- **PKCE**: Uses SHA-256 hashing for the code challenge.
- **localhost support**: The `TIKTOK_REDIRECT_URI` can be set to any localhost port for development.
- **State Parameter**: The `getAuthorizationUrl` accepts an optional `state` parameter for CSRF protection.

## Testing

Run tests using Vitest:

```bash
npm test src/auth/tiktok.test.ts
```

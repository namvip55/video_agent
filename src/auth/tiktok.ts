import crypto from "node:crypto";
import axios from "axios";
import { type TiktokConfig } from "../config.js";

/**
 * Result of the PKCE generation.
 */
export interface PKCEResult {
  code_verifier: string;
  code_challenge: string;
}

/**
 * TikTok Access Token response.
 */
export interface TikTokTokenResponse {
  access_token: string;
  open_id: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  scope: string;
}

/**
 * TikTok OAuth Service with PKCE support.
 */
export class TikTokAuthService {
  private config: TiktokConfig;

  constructor(config: TiktokConfig) {
    this.config = config;
  }

  /**
   * Generates a random code_verifier and its corresponding code_challenge for PKCE.
   */
  generatePKCE(): PKCEResult {
    const code_verifier = crypto.randomBytes(32).toString("hex");
    const code_challenge = crypto
      .createHash("sha256")
      .update(code_verifier)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    return { code_verifier, code_challenge };
  }

  /**
   * Generates the TikTok Authorization URL.
   * @param code_challenge The code challenge generated from PKCE.
   * @param state An optional state string for CSRF protection.
   */
  getAuthorizationUrl(code_challenge: string, state: string = "static_state"): string {
    const { clientId, redirectUri } = this.config;

    if (!clientId) throw new Error("TIKTOK_CLIENT_ID is missing in config");
    if (!redirectUri) throw new Error("TIKTOK_REDIRECT_URI is missing in config");

    const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
    url.searchParams.append("client_key", clientId);
    url.searchParams.append("scope", "user.info.basic,video.upload,video.publish");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", redirectUri);
    url.searchParams.append("state", state);
    url.searchParams.append("code_challenge", code_challenge);
    url.searchParams.append("code_challenge_method", "S256");

    return url.toString();
  }

  /**
   * Exchanges the authorization code for an access token using PKCE.
   * @param code The authorization code received from TikTok.
   * @param code_verifier The original code verifier used to generate the challenge.
   */
  async exchangeCodeForToken(code: string, code_verifier: string): Promise<TikTokTokenResponse> {
    const { clientId, clientSecret, redirectUri } = this.config;

    if (!clientId) throw new Error("TIKTOK_CLIENT_ID is missing in config");
    if (!clientSecret) throw new Error("TIKTOK_CLIENT_SECRET is missing in config");
    if (!redirectUri) throw new Error("TIKTOK_REDIRECT_URI is missing in config");

    const params = new URLSearchParams();
    params.append("client_key", clientId);
    params.append("client_secret", clientSecret);
    params.append("code", code);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", redirectUri);
    params.append("code_verifier", code_verifier);

    const response = await axios.post("https://open.tiktokapis.com/v2/oauth/token/", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.error) {
      throw new Error(`TikTok Auth Error: ${response.data.error_description || response.data.error}`);
    }

    return response.data as TikTokTokenResponse;
  }
}

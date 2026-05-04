import { describe, it, expect } from "vitest";
import { TikTokAuthService } from "./tiktok.js";

describe("TikTokAuthService", () => {
  const mockConfig = {
    displayName: "Test",
    handle: "@test",
    followers: "100",
    clientId: "abc",
    clientSecret: "secret",
    redirectUri: "http://localhost:3000/callback",
  };

  const service = new TikTokAuthService(mockConfig);

  it("generates valid PKCE code_verifier and code_challenge", () => {
    const { code_verifier, code_challenge } = service.generatePKCE();

    expect(code_verifier).toBeDefined();
    expect(code_challenge).toBeDefined();
    expect(code_verifier.length).toBeGreaterThan(32);
    // Base64Url format check (no +, /, or =)
    expect(code_challenge).not.toMatch(/[+/=]/);
  });

  it("generates correct authorization URL", () => {
    const code_challenge = "mock_challenge";
    const urlString = service.getAuthorizationUrl(code_challenge, "test_state");
    const url = new URL(urlString);

    expect(url.origin).toBe("https://www.tiktok.com");
    expect(url.pathname).toBe("/v2/auth/authorize/");
    expect(url.searchParams.get("client_key")).toBe("abc");
    expect(url.searchParams.get("scope")).toContain("video.upload");
    expect(url.searchParams.get("code_challenge")).toBe("mock_challenge");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
  });
});

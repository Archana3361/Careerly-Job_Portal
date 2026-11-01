const SECRET_STORAGE_KEY = "careerly_jwt_secret";
const ALGORITHM = "HS256";
let memorySecret = "";

const toBase64Url = (bytes) => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  const base64 = typeof window !== "undefined" && typeof window.btoa === "function"
    ? window.btoa(binary)
    : Buffer.from(binary, "binary").toString("base64");

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const fromBase64Url = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  const binary = typeof window !== "undefined" && typeof window.atob === "function"
    ? window.atob(padded)
    : Buffer.from(padded, "base64").toString("binary");

  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const base64UrlToUint8Array = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  const binary = typeof window !== "undefined" && typeof window.atob === "function"
    ? window.atob(padded)
    : Buffer.from(padded, "base64").toString("binary");

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const getSigningKey = async () => {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Web Crypto API is not available in this environment.");
  }

  let secret = "";

  if (typeof localStorage !== "undefined") {
    secret = localStorage.getItem(SECRET_STORAGE_KEY) || "";
  }

  if (!secret) {
    secret = memorySecret;
  }

  if (!secret) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    secret = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    memorySecret = secret;

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(SECRET_STORAGE_KEY, secret);
    }
  }

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
};

export const createJwt = async (payload, options = {}) => {
  const tokenPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: options.exp ?? Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  };

  const header = { alg: ALGORITHM, typ: "JWT" };
  const encodedHeader = toBase64Url(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = toBase64Url(new TextEncoder().encode(JSON.stringify(tokenPayload)));
  const signingKey = await getSigningKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    signingKey,
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  );

  return `${encodedHeader}.${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`;
};

export const verifyJwt = async (token) => {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerBase64, payloadBase64, signatureBase64] = parts;

  try {
    const signingKey = await getSigningKey();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      signingKey,
      base64UrlToUint8Array(signatureBase64),
      new TextEncoder().encode(`${headerBase64}.${payloadBase64}`)
    );

    if (!isValid) return null;

    const payload = JSON.parse(fromBase64Url(payloadBase64));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

export const decodeJwt = (token) => {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    return JSON.parse(fromBase64Url(parts[1]));
  } catch {
    return null;
  }
};

import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: number;
  img: string;
  sub: string;
  roles: { authority: string }[];
  exp: number;
  iat: number;
}

export function getUserFromToken(): TokenPayload | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
}

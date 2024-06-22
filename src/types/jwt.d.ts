export interface IJWTPayload {
  id: string;
  email: string;
  sessionId: string;
  iat: number;
  exp: number;
}

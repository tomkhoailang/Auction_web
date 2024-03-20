interface Token {
  Token: string;
  ExpirationTokenDate: Date;
}

export interface AuthResponse {
  AccessToken: Token;
  RefreshToken: Token;
}

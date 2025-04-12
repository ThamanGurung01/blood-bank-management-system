export interface AUser {
    id: string;
    email: string;
    password: string;
    role?: string;
     isPasswordCorrect(password: string): Promise<boolean>;
  }
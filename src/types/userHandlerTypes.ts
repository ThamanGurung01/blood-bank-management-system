export interface AUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role?: string;
     isPasswordCorrect(password: string): Promise<boolean>;
  }
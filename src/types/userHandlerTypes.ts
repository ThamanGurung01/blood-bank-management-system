export interface AUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role?: string;
     isPasswordCorrect(password: string): Promise<boolean>;
  }
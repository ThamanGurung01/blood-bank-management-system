import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { connectToDb } from "@/utils/database";
import User from "@/models/user.models";
import Donor from "@/models/donor.models";
import BloodBank from "@/models/blood_bank.models";
import { AUser } from "@/types/userHandlerTypes";
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name:string;
      email:string;
      role?: string;
    } & DefaultSession["user"];
  }
}
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        await connectToDb();
        const user = await User.findOne({ email: credentials.email }) as AUser;
        if (!user) throw new Error("User not found");

        const isPasswordCorrect = await user.isPasswordCorrect(credentials.password);
        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }
        if(user.role==="donor"){
          const donorData=await Donor.findOne({user:user._id});
          if (!donorData) return null;
          return {
            id: donorData._id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        } else if(user.role==="blood_bank"){
          const bloodBankData=await BloodBank.findOne({user:user._id});
          if (!bloodBankData) return null;
          return {
            id: bloodBankData._id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        } else if(user.role==="admin"){
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        }
        return null;
      }
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as unknown as AUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    // async redirect({ baseUrl }) {
    //   return `${baseUrl}/dashboard`;
    // },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

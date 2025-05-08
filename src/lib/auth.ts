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
      async authorize(credentials) {
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
          const donorData=await Donor.findOne({user:user.id});
          console.log(user.id);

          console.log("donorData",donorData);
          return {id:donorData?._id,
            name:user.name,
            email:user.email,
            role: user.role
          };
        }else if(user.role==="blood_bank"){
          const bloodBankData=await BloodBank.findOne({user:user.id});
          console.log({...user,id:bloodBankData?._id});
          return {id:bloodBankData?._id,
            name:user.name,
            email:user.email,
            role: user.role
          };
        }else {
          return user;
        }
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
        token.role = (user as AUser).role;
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
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

import { connectToDb } from "@/utils/database";
import NextAuth, {  DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user.models";
export interface User {
  id: string;
  email: string;
  password: string;
  role?: string;
}
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

const handler = NextAuth({
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "email", type: "text", placeholder: "jsmith@example.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req): Promise<User | null> {
           try {
            if (!credentials?.email || !credentials?.password) {
              throw new Error("Missing credentials");
            }
            await connectToDb();
            const user = await User.findOne({ email: credentials.email }) as User;
            if (!user) throw new Error("User not found");
            console.log("next auth user"+user);
            if (user) {
              return user
            } else {
              return null
            }

           } catch (error) {
            console.log(error);
            return null;
           }
          },
          
        })
      ],
      pages: {
        signIn: "/login",
      },
      callbacks:{
        async jwt({token,user}){
          if (user) {
            token.id = user.id;
            token.name=user.name;
            token.email=user.email;
            token.role = (user as User).role;
          }
          return token;
        },
        async session({ session, token }) {
          if (session.user) {
            session.user.id = token.id as string;
            token.name=token.name;
            token.email=token.email;
            session.user.role = token.role as string;
          }
          return session;
        },
        async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : "/"; 
    },
      },
      session:{
        strategy:"jwt",
      },
      secret:process.env.NEXTAUTH_SECRET,
})
export { handler as GET, handler as POST }
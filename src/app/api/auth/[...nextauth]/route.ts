import { connectToDb } from "@/utils/database";
import NextAuth, {  DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user.models";
export interface AUser {
  id: string;
  email: string;
  password: string;
  role?: string;
   isPasswordCorrect(password: string): Promise<boolean>;
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
          async authorize(credentials, req): Promise<AUser | null> {
           try {
            if (!credentials?.email || !credentials?.password) {
              throw new Error("Missing credentials");
            }
            await connectToDb();
            const user = await User.findOne({ email: credentials.email }) as AUser;
            if (!user) throw new Error("User not found");
            console.log("next auth user"+user);
            const isPasswordCorrect=await user.isPasswordCorrect(credentials.password);
            if (!isPasswordCorrect) {
              throw new Error("The password you've entered is incorrect");
            }
            return user
           } catch (error:any) {
            if(error){
              throw new Error(error.message);
            }else{
              throw new Error("Authentication error");
            }
           }
          },
        })
      ],
      pages: {
        signIn: "/",
        error:"/",
      },
      callbacks:{
        async jwt({token,user}){
          if (user) {
            token.id = user.id;
            token.name=user.name;
            token.email=user.email;
            token.role = (user as AUser).role;
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
      return `${baseUrl}/dashboard`; 
    },
      },
      session:{
        strategy:"jwt",
      },
      secret:process.env.NEXTAUTH_SECRET,
})
export { handler as GET, handler as POST }
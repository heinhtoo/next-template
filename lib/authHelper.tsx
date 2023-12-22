import { Role } from "@prisma/client";
import { Session, NextAuthOptions } from "next-auth";
import prisma from "@/prisma/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

const crypto = require("crypto");
const algorithm = "aes-256-cbc"; // Using AES encryption
const key = "gu3wTzLfRyxJnTEJ3yBt4qE5XXuSbF2b";

export const All = "All";

export const authOptions: NextAuthOptions = {
  // your configs
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "E-mail",
          type: "email",
          placeholder: "jsmith@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (email && password) {
          try {
            const userInfo = await prisma.user.findFirst({
              where: {
                email: email.toLowerCase(),
              },
            });

            if (userInfo) {
              const userPassword = decrypt({
                encryptedData: userInfo.encryptedData,
                iv: userInfo.iv,
              });
              if (userPassword === password) {
                return userInfo;
              } else {
                return null;
              }
            }
            return null;
          } catch (err) {
            // console.error(err);
          }
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, user, token }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          id: token.id ?? "",
        },
      });
      if (dbUser) {
        const { iv, encryptedData, ...userWithoutPassword } = dbUser;
        session.user = userWithoutPassword;
        return session;
      } else {
        return session;
      }
    },
    jwt: async ({ token, user }: any) => {
      // If successfully sign in, keep Firebase Authentication user info
      // in JWT payload
      if (user) {
        token.id = user.id;
        const dbUser = await prisma.user.findFirst({
          where: {
            id: token.id ?? "",
          },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
  },
};

export function isSuperAdmin(session: Session | null) {
  if (session && session.user && session.user.role === Role.SuperAdmin) {
    return true;
  }
  return false;
}

export function isInternal(session: Session | null) {
  if (
    session &&
    session.user &&
    (session.user.role === Role.SuperAdmin || session.user.role === Role.Admin)
  ) {
    return true;
  }
  return false;
}

export function encrypt(text: string) {
  // Encrypting text
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

// Decrypting text
export function decrypt(text: { iv: string; encryptedData: string }) {
  const iv = Buffer.from(text.iv, "hex");
  const encryptedText = Buffer.from(text.encryptedData, "hex");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

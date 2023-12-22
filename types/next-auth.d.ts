import { User } from "@prisma/client";

type UserWithoutPassword = Omit<Omit<User, "iv">, "encryptedData">;

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: UserWithoutPassword | null;
  }
}

import { encrypt } from "@/lib/authHelper";
import prisma from "@/prisma/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  const userCount = await prisma.user.count({});
  if (userCount === 0) {
    const encryptPwd = encrypt("123123");
    await prisma.user.create({
      data: {
        email: "heinhtoozaw99@gmail.com",
        encryptedData: encryptPwd.encryptedData,
        iv: encryptPwd.iv,
        username: "Hein Htoo",
        isBlocked: false,
        role: Role.SuperAdmin,
      },
    });
    return Response.json({ userCount: 1 });
  }

  return Response.json({ userCount });
}

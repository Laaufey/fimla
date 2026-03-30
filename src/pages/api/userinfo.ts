import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        const userInfo = await prisma.userInfo.findMany();
        return res.status(200).json(userInfo);
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Error reading from database", success: false });
      }
      break;
    case "POST":
      try {
        const userInfo = await prisma.userInfo.create({
          data: {
            userEmail: body.userEmail,
            username: body.userName,
            userDob: body.userDob,
            userLocation: body.userLocation,
          },
        });
        return res.status(200).json(userInfo);
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Error adding to database", success: false });
      }
      break;
    case "PUT":
      try {
        const userInfo = await prisma.userInfo.update({
          where: {
            userEmail: body.userEmail,
          },
          data: {
            username: body.userName,
            userDob: body.userDob,
            userLocation: body.userLocation,
          },
        });
        return res.status(200).json(userInfo);
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Error adding to database", success: false });
      }
      break;
    default:
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}

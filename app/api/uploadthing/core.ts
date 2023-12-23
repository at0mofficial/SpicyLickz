import { createUploadthing, type FileRouter } from 
"uploadthing/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import User from "@/lib/models/user.model";
const f = createUploadthing();
 
export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount:1 } })
  .middleware(async ({ req }) => {
    const session = await getServerSession(authOptions);
      if(!session || !session.user){
          throw new Error("Unauthorized");
        }
        return { userId: session.user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
        try {
          const user = await User.findByIdAndUpdate(
            metadata.userId,
            { imageUrl: file.url },
            { new: true }
          );
          return user.imageUrl;
        } catch (error:any) {
          throw new Error(`Error updating user image: ${error.message}`);
        }
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
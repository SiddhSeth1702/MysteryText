import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";




export async function DELETE(req: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid
    await dbConnect()
    const session = await getServerSession(authOption)
    const user: User = session?.user
    if (!session || session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
            {
                status: 401
            }
        )
    }
    try {
        const updatedResult = await UserModel.updateOne({
            _id: user._id
        },
            {
                $pull: { messages: { _id: messageId } }
            })
        if (updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            },
                {
                    status: 404
                })
        }
        return Response.json({
            success: true,
            message: "Message deleted"
        },
            {
                status: 200
            })
    }
    catch (err) {
        console.log("Error in delete message route", err)
        return Response.json({
            success: false,
            message: "Error deleting message"
        },
            {
                status: 500
            })
    }

}
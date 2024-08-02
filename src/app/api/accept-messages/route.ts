import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";


export async function POST(req: Request) {
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
    const userId = user._id;
    const { acceptMessages } = await req.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptMessages
        }, { new: true })
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages",
                updatedUser
            },
                {
                    status: 401
                }
            )
        }
        return Response.json({
            success: true,
            message: "Message acceptance status updated succesfully"
        },
            {
                status: 200
            }
        )
    }
    catch (err) {
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        },
            {
                status: 500
            }
        )
    }

}


export async function GET(req: Request) {
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
    const userId = user._id;
    const foundUser = await UserModel.findById(userId)

    try {
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found",

            },
                {
                    status: 500
                }
            )
        }
        return Response.json({
            success: false,
            isAcceptingMessages: foundUser.isAcceptingMessage,

        },
            {
                status: 200
            }
        )
    }
    catch (err) {
        return Response.json({
            success: false,
            message: "Error in getting message accepting status"
        },
            {
                status: 500
            }
        )
    }

}
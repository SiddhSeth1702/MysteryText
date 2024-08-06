import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";


export async function POST(req: Request) {
    await dbConnect()
    const { username, content } = await req.json()

    try {
        const user = await UserModel.findOne({
            username
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                {
                    status: 404
                }
            )
        }
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting the messages"
            },
                {
                    status: 403
                }
            )
        }
        const newMessage = { content, createdAt: new Date() };

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );
    } catch (err) {

        return Response.json({
            success: false,
            message: "Error sending message",
        },
            {
                status: 500
            }
        )
    }
}
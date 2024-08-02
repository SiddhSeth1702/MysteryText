import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod';


export async function POST(req: Request) {
    await dbConnect()

    try {
        const { username, code } = await req.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username: decodedUsername
        })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                {
                    status: 500
                }
            )
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save()
            return Response.json({
                success: false,
                message: "Account verified successfully"
            },
                {
                    status: 200
                }
            )
        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired .Please signup again to get new code"
            },
                {
                    status: 400
                }
            )
        }
        else {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            },
                {
                    status: 200
                }
            )
        }
    }
    catch (err) {
        console.error("Error checkin username", err)
        return Response.json({
            success: false,
            message: "Error verifing user"
        },
            {
                status: 500
            }
        )
    }
}
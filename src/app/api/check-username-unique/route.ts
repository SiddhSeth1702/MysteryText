import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod';
import { usernameValidation } from "@/schema/signUpSchema";



const userQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(req: Request) {

    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const queryParams = {
            username: searchParams.get('username')
        }


        //validating with zod herer
        const results = userQuerySchema.safeParse(queryParams)
        // console.log(results)
        if (!results.success) {
            const usernameErrors = results.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invalid query parameter"
            }, {
                status: 400
            })
        }
        const { username } = results.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            })
        }
        return Response.json({
            success: true,
            message: "Username is unique"
        }, {
            status: 200
        })


    }
    catch (err) {
        console.error("Error checkin username", err)
        return Response.json({
            success: false,
            message: "Error checking username"
        },
            {
                status: 500
            }
        )
    }
}
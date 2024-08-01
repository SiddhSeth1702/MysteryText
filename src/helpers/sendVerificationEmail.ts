import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'MysteryText <onboarding@resend.dev>',
            to: email,
            subject: ' MysteryText | Verification Code ',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return {
            success: true,
            message: "Verification email send succesfullt"
        }
    }
    catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}
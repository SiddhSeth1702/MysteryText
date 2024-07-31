import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(3, "username must contain atleast 3 character")
    .max(20, "username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be of atleast 8 characters" })
})
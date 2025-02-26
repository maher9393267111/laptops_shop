import connectToDB from "@/config/db";
import UserModel from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcrypt";
import { serialize } from "cookie";
import { tokenGenerator } from "@/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'POST') return res.status(421).json({ message: "This route can't be accessed without POST request!" })

    try {
        await connectToDB()

        const { payload, password } = req.body
        const userData = await UserModel.findOne({ $or: [{ username: payload }, { email: payload }] })

        if (!userData) return res.status(401).json({ message: 'کاربری با این اسم المستخدم/الايميل یافت نشد' })

        if (! await compare(password, userData.password)) return res.status(401).json({ message: 'اسم المستخدم یا الايميل با رمز وارد شده مطابقت ندارد' })

        if (userData.isBan) return res.status(403).json({ message: 'حساب شما بدلیل نقض قوانین مسدود شده' })

        const token = tokenGenerator(userData.email, 7)

        return res
            .setHeader("Set-Cookie", serialize("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 6 }))
            .status(201).json({ userData, message: 'ورود با موفقیت انجام شد.' })

    } catch (err) {
        console.log(err)
        return res.status(421).json({ message: 'خطای ناشناخته / بعدا تلاش کنید' })
    }
}

export default handler;
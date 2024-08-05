import connectToDB from "@/config/db";
import DiscountModel from "@/models/Discount/Discount";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'POST') return res.status(421).json({ message: "This route can't be accessed without POST request_" })

    try {

        await connectToDB()

        const { code } = req.body

        if (!code) return res.status(422).json({ message: 'Hey we need the discount code to delete it k?' })

        await DiscountModel.findOneAndDelete({ code })

        return res.status(200).json({ message: 'کد تخفیف با موفقیت حذف شد' })

    } catch (err) {
        console.log(err)
        return res.status(421).json({ message: 'خطای ناشناخته / بعدا تلاش کنید', err })
    }
}

export default handler;
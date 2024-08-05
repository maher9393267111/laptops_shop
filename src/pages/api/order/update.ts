import connectToDB from "@/config/db";
import { TransactionProductsTypes } from "@/global.t";
import ProductModel from "@/models/Product";
import { transactionModel } from "@/models/Transactions";
import { NotificationModel } from "@/models/UserRelatedSchemas";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'POST') return res.status(421).json({ message: "This route can't be accessed without POST request_" })

    try {

        await connectToDB()

        const { key, value, transactionID } = req.body

        if (!key || !value || !transactionID) return res.status(422).json({ message: 'all needed data to update the transaction did not received' })

        const updatedTransaction = await transactionModel.findOneAndUpdate({ _id: transactionID }, { [key]: value })

        if (key == 'status' && value == 'CANCELED') {
            updatedTransaction.productsList.map(async (data: TransactionProductsTypes) => {
                await ProductModel.findOneAndUpdate({ _id: data.productID._id }, { $inc: { customers: -1 } })
            })
        }

        await NotificationModel.create({ userID: updatedTransaction.userID, body: `سفارش شما با کد ${transactionID.slice(-6, -1).toUpperCase()}  با موفقیت الغاء شد 🥲‍` })

        return res.status(200).json({ message: `سفارش شما با موفقیت الغاء شد` })

    } catch (err) {
        console.log(err)
        return res.status(421).json({ message: 'خطای ناشناخته / بعدا تلاش کنید', err })
    }
}

export default handler;
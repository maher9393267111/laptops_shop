import Button from "@/components/Button"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Progress from "@/components/Progress"
import { showToast, totalPriceCalculator } from "@/utils"
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/Hooks/useRedux"
import Loader from "@/components/Loader"
import { modalDataUpdater, userUpdater } from "@/Redux/Features/globalVarsSlice"
import { TransactionProductsTypes, TransactionProps } from "@/global.t"
import Link from "next/link"


const TransactionDetails = () => {

    const navigate = useRouter()
    const dispatch = useAppDispatch()

    const { Transaction } = useAppSelector(state => state.userSlice.relatedData) || {}

    const [transactionData, setTransactionData] = useState<TransactionProps>()
    const [showMoreShown, setShowMoreShown] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        if (Transaction?.length && navigate.query?.id) {

            const getTransaction = Transaction.find(data => data._id == navigate.query.id)

            if (!getTransaction) navigate.replace('/') // if user change the route id with an invalid one

            setTransactionData(getTransaction)
        }

    }, [Transaction, navigate.query?.id, navigate])

    const cancelTransaction = async () => {

        dispatch(modalDataUpdater({
            isShown: true,
            title: 'الغاء سفارش',
            message: 'آیا تصمیم به الغاء سفارش خود دارید؟',
            fn: async () => {
                try {

                    if (isLoading) return

                    setIsLoading(true)

                    const res = await fetch('/api/order/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key: 'status', value: 'CANCELED', transactionID: transactionData?._id })
                    })

                    const data = await res.json()

                    showToast(res.ok, data.message)
                    res.ok && dispatch(userUpdater())
                    setIsLoading(false)

                } catch (error) {
                    console.log(error)
                    setIsLoading(false)
                }
            }
        }))

    }

    const sumOfProductsWithDiscount = useMemo(() => {
        return transactionData?.productsList.reduce((a, b) => a + totalPriceCalculator(b.productID.price, b.productID.discount, b.count, b.services), 0)
    }, [transactionData?.productsList])

    return (

        <section className="bg-primary-black">

            <Header />

            <span className='md:pt-[180px] pt-[165px] block'></span>

            <div className="container mb-12">

                <Progress />

                {
                    !transactionData ? <div className="bg-primary-black h-52"></div>
                        :
                        <div className="flex md:flex-row flex-col xl:gap-5 gap-3">

                            <div className="flex-1 ch:bg-secondary-black ch:p-3 gap-1 flex flex-col ch:rounded-sm">

                                <div className="text-[13px] flex flex-col gap-4 text-description-text">

                                    <h3 className="text-center font-peyda text-xl text-gold pb-3">معلومات الطلب</h3>

                                    <div className="flex justify-between">

                                        <p className="font-peyda text-md">حالة الطلب:</p>

                                        <p className={`${transactionData?.status == 'PROCESSING' ? 'text-dark-gold/70' : transactionData?.status == 'DELIVERED' ? 'text-green' : 'text-white-red'}`}>
                                            {
                                                transactionData?.status == 'DELIVERED'
                                                    ?
                                                    'ارسال موفق'
                                                    :
                                                    transactionData?.status == 'PROCESSING'
                                                        ?
                                                        'مرحلة الارسال'
                                                        :
                                                        'الغاء شده'
                                            }
                                        </p>
                                    </div>

                                    <div className="flex justify-between">
                                        <p className="font-peyda text-md">رمز الطلب :</p>
                                        <p dir="ltr">#{transactionData?._id?.slice(-6, -1).toUpperCase()}</p>
                                    </div>

                                    <div className="flex justify-between">
                                        <p className="font-peyda text-md">حالة السداد:</p>
                                        <p>تسویه شده</p>
                                    </div>

                                    <div className="flex justify-between">
                                        <p className="font-peyda text-md">إجمالي المبلغ:</p>
                                        <p> {sumOfProductsWithDiscount} ريال </p>
                                    </div>

                                </div>

                                <div className="text-[13px] flex flex-col gap-4 text-description-text font-peyda">

                                    <div className="font-bold flex justify-between">
                                        <p>الاسم الأول والاسم الأخير: </p>
                                        <p className="font-sans">{transactionData?.customerData?.name + ' ' + transactionData?.customerData?.lName}</p>
                                    </div>

                                    <div className="font-bold flex justify-between">
                                        <p>العنوان </p>
                                        <p className="font-sans">{'ایران - ' + transactionData?.customerData?.ostan + ' - ' + transactionData?.customerData?.province}</p>
                                    </div>

                                    {
                                        showMoreShown
                                            ?
                                            <>
                                                <div className="font-bold flex justify-between">
                                                    <p> الكود البريدي </p>
                                                    <p className="font-sans">{transactionData?.customerData.codePost}</p>
                                                </div>

                                                <div className="font-bold flex justify-between">
                                                    <p>رقم الهاتف: </p>
                                                    <p className="font-sans">{transactionData?.customerData.phoneNum}</p>
                                                </div>

                                                <div className="font-bold flex justify-between">
                                                    <p>الايميل: </p>
                                                    <p className="font-sans">{transactionData?.customerData?.email || 'الايميل یافت نشد'}</p>
                                                </div>

                                                <div className="font-bold flex justify-between">
                                                    <p>تفاصيل الطلب : </p>
                                                    <p className="font-sans">{transactionData?.customerData?.orderDetails || 'توضیحات یافت نشد'}</p>
                                                </div>
                                            </>
                                            : null
                                    }

                                    <div onClick={() => setShowMoreShown(prev => !prev)} className="inline-flex w-1/3 m-auto rounded-md gap-2 text-center justify-center items-center p-1 text-md text-white-red cursor-pointer hover:bg-white-red hover:text-white transition-all">
                                        <div>مشاهده <span>{showMoreShown ? 'اقل' : 'المزيد'}</span></div>
                                        <IoIosArrowDown className={`size-5 ${showMoreShown && 'rotate-180'} transition-all duration-300 `} />
                                    </div>

                                </div>

                                <div className="flex flex-col items-center justify-center gap-3 w-full ch:w-full">

                                    <div className="flex items-center gap-3 m-auto mt-0 justify-start w-full ch:w-full">
                                        <Button fn={() => navigate.replace('/profile?menu=orders')} text="الملف الشخصي" />
                                        <Button fn={() => navigate.replace('/')} text="الرئيسية" />
                                    </div>

                                    {
                                        transactionData?.status == 'PROCESSING'
                                            ?
                                            <Button
                                                fn={cancelTransaction}
                                                Icon={isLoading ? <Loader /> : <></>}
                                                text={isLoading ? '' : "إلغاء الطلب"}

                                                filled
                                            />
                                            : null
                                    }

                                </div>

                            </div>

                            <div className="flex-[2]  rounded-sm space-y-2">

                                {
                                    transactionData?.productsList?.length
                                    &&
                                    transactionData?.productsList.map(data => <UserOrder key={data.productID?._id} {...data} />)
                                }

                                <div className="border p-3 border-gray-500 rounded-sm flex justify-between font-peyda">

                                    <div className="flex items-center gap-2">
                                        <p className="text-gold/75">رمز الطلب : </p>
                                        <p dir="ltr" className="text-description-text font-bold"> # {transactionData?._id?.slice(-6, -1).toUpperCase()}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <p className="text-gold/75">مجموع: </p>
                                        <div className="text-description-text font-sans font-bold mt-1"> <span>{sumOfProductsWithDiscount}</span> ريال </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                }

            </div>

            <Footer />
        </section>
    )
}

export default TransactionDetails;

const UserOrder = ({ productID, count, services }: TransactionProductsTypes) => {

    return (
        <div className="border p-2 border-gray-500 flex flex-col">

            <div className="flex gap-2 ch:h-18 ch:m-auto">

                <div className="size-24 aspect">
                    <Image
                        className=" object-contain bg-center flex-1 h-full w-full"
                        alt={productID?.name}
                        width={100}
                        height={100}
                        quality={100}
                        loading="lazy"
                        src={productID?.image?.length ? productID?.image[0] : '/images/imageNotFound.webp'}
                    />
                </div>

                <div className="flex-[4] mb-auto">
                    <Link href={`/products/search/${productID._id}`} className="text-title-text text-md">{productID?.name} <span className="text-[12px] text-description-text">({Object.keys(services)?.join(', ')} )</span> </Link>
                </div>

            </div>

            <div className="flex justify-between text-description-text">
                <div>العدد:  <span className="text-white-red font-peyda">{count}</span> </div>
                <div><span className="text-white-red">{totalPriceCalculator(productID?.price, productID?.discount, count, services, true)}</span> ريال </div>
            </div>
        </div>
    )
}
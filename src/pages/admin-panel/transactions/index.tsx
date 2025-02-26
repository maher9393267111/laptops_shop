import Button from '@/components/Button'
import Loader from '@/components/Loader'
import Discount from '@/components/p-admin/Discount'
import Layout from '@/components/p-admin/Layout'
import Pagination from '@/components/p-admin/Pagination'
import TransactionData from '@/components/p-admin/TransactionsData'
import { TransactionProps } from '@/global.t'
import React, { useEffect, useState } from 'react'


const Index = () => {

    const [transactions, updateTransactions] = useState<TransactionProps[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [allPages, setAllPages] = useState(0)
    const [updater, setUpdater] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)

    useEffect(() => {

        (async () => {

            if (isLoading) return

            try {
                setIsLoading(true)

                const res = await fetch('/api/order/getAll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentPage })
                })

                const { transactions: newTransactions, availablePages } = await res.json()
                if (!newTransactions?.length) return setIsEmpty(true)

                setAllPages(availablePages)
                updateTransactions([...newTransactions])
                setIsEmpty(false)

            } catch (error) { console.log(error) }
            finally { setIsLoading(false) }
        })()

    }, [currentPage, updater])

    return (
        <div>
            <Layout>
                <div>

                    <h3 className='md:text-[26px] text-xl font-peyda font-bold text-panel-darkBlue'>ادارة الالطلبات</h3>

                    <div className='grid grid-cols-1 mdLmt-7 mt-4 overflow-auto'>

                        <table className='w-full text-center overflow-x-auto rounded-md min-w-[730px] '>

                            <thead>
                                <tr className='font-peyda sm:text-[14px] text-[13px] text-center w-full ch:bg-white ch:py-2 ch:text-panel-darkTitle'>
                                    <td>رمز التعريف</td>
                                    <td>الاسم</td>
                                    <td>الايميل</td>
                                    <td>تاریخ</td>
                                    <td>فروش</td>
                                    <td className='whitespace-nowrap w-20 relative'>حالة الطلب</td>
                                </tr>
                            </thead>

                            <tbody className='overflow-auto border border-white'>
                                {
                                    transactions?.length
                                        ?
                                        transactions.map((discountData, index) => <TransactionData
                                            transactionsUpdater={() => setUpdater(prev => !prev)}
                                            rowNumber={index + ((currentPage - 1) * 12)}
                                            key={discountData.createdAt}
                                            {...discountData}
                                        />)
                                        : null
                                }
                            </tbody>
                        </table>

                        {
                            transactions?.length
                                ?
                                <Pagination
                                    currentPage={currentPage}
                                    latestPage={allPages}
                                    currentPageUpdater={page => setCurrentPage(page)}
                                />
                                : null
                        }

                        {isEmpty ? <div data-aos='zoom-in' className='w-full flex-center text-[22px] text-panel-darkRed py-2 border border-white font-peyda font-bold text-center'>سفارشی  وجود ندارد</div> : null}

                    </div>

                </div>
            </Layout>

        </div>
    )
}

export default Index
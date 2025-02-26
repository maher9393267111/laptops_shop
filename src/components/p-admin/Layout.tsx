import { ReactNode, useState } from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { RiFileList3Line } from "react-icons/ri";
import { LiaComment } from "react-icons/lia";
import PageLinks from '@/components/p-admin/PageLinks';
import { CiSearch } from "react-icons/ci";
import { RiLogoutBoxLine } from "react-icons/ri";
import { RiDiscountPercentLine } from "react-icons/ri";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { MdNotificationsNone } from "react-icons/md";
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/Hooks/useRedux';
import { useRouter } from 'next/router';
import { LuPanelRightOpen } from "react-icons/lu";
import { modalDataUpdater } from '@/Redux/Features/globalVarsSlice';
import { showToast } from '@/utils';
import { RiAdminFill } from "react-icons/ri";
import { userDataUpdater } from '@/Redux/Features/userSlice';
import Image from 'next/image';
import Notifications from './Notifications';

const Layout = ({ children }: { children: ReactNode }) => {

    const [searchValue, setSearchValue] = useState('')
    const { nameLastName, username, profile } = useAppSelector(state => state.userSlice.data) || {}
    const [showDashboardLinks, setShowDashboardLinks] = useState(false)

    const notifications = useAppSelector(state => state.userSlice.relatedData?.dashboardNotifications) || []
    const dispatch = useAppDispatch()
    const navigate = useRouter()

    const globalSearch = () => showToast(false, `نتیجه ای برای ${searchValue} پیدا نشد`) // for now (:

    const logout = async () => {
        dispatch(modalDataUpdater({
            isShown: true, title: 'خروج از حساب', message: 'آیا قصد خروج از حسابتان را دارید؟', okButtonText: 'بله', fn: async () => {

                const res = await fetch('/api/auth/logout')
                const resData = await res.json()

                showToast(res.ok, resData.message)

                if (res.ok) {
                    dispatch(userDataUpdater({ isLogin: false }))
                    navigate.push('/')
                }
            }
        }))
    }

    return (
        <div className='flex bg-panel-white min-h-screen'>

            <span
                onClick={() => setShowDashboardLinks(prev => !prev)}
                className='fixed md:hidden cursor-pointer bottom-3 right-3 border-2 border-white shadow-md rounded-full size-[60px] flex-center bg-panel-caption text-white z-[9999999999]'
            >
                <LuPanelRightOpen className={`size-6 transition-all  ${showDashboardLinks && 'rotate-180'}`} />
            </span>

            <style jsx global>
                {
                    `
                        ::-webkit-scrollbar {
                            display: none;
                        }
                    `
                }
            </style>

            <aside className={`bg-white fixed w-20 md:sticky ${showDashboardLinks ? 'right-0' : '-right-20 md:right-0'} transition-all top-0 bottom-0 z-[9999] xl:w-[190px]`}>
                <div className='sticky top-0 xl:p-5 p-3'>
                    <div>
                        <Link href={'/'} className='flex items-start justify-center gap-px flex-col'>
                            <div className='relative xl:block hidden'>
                                <h1 className='text-[#333333] font-extrabold text-[25px] font-peyda'>متجر الكترونيات</h1>
                                <span className='absolute size-2 rounded-full bg-panel-darkGreen bottom-2 -left-3'></span>
                            </div>
                            <div className='xl:hidden block'><Image width={100} height={100} quality={100} alt='pc-kala favicon' src='/images/fav-logo.png' /></div>
                        </Link>

                        <div className='flex justify-center ch:ch:shrink-0 flex-col mt-10'>

                            <PageLinks
                                Icon={<IoHomeOutline />}
                                title={'داشبرد'}
                                path='/admin-panel'
                                key={'dashboard'}
                            />

                            <PageLinks
                                Icon={<RiShoppingBasket2Line />}
                                title={'المنتجات'}
                                path='/admin-panel/products'
                                key={'products'}
                            />

                            <PageLinks
                                Icon={<FiUsers />}
                                title={'المستخدمين'}
                                path='/admin-panel/users'
                                key={'users'}
                            />

                            <PageLinks
                                Icon={<RiFileList3Line />}
                                title={'الدفعات'}
                                path='/admin-panel/transactions'
                                key={'transactions'}
                            />

                            <PageLinks
                                Icon={<RiDiscountPercentLine />}
                                title={'الخصومات'}
                                path='/admin-panel/discounts'
                                key={'discounts'}
                            />

                            <PageLinks
                                Icon={<LiaComment />}
                                title={' التعليقات'}
                                path='/admin-panel/comments'
                                key={'comments'}
                            />

                            <PageLinks
                                Icon={<MdNotificationsNone />}
                                title={'الاشعارات'}
                                path='/admin-panel/notifications'
                                key={'settings'}
                            />

                            <span className='py-10 border-b mb-4 border-[#D0D6DE]'></span>

                            <button
                                className={`flex gap-2 items-center relative justify-center xl:justify-start p-3 text-red-500 bg-red-500/15 ch:transition-all duration-200 ease-in-out rounded-md ch:font-extrabold font-peyda`}
                                name='logout button'
                                onClick={logout}
                            >
                                <RiLogoutBoxLine className='size-6' />
                                <span className='xl:block hidden'>خروج</span>
                                <span className='absolute -right-5 h-5/6 w-[6px] rounded-l-md bg-panel-darkRed'></span>
                            </button>

                        </div>
                    </div>
                </div>
            </aside>

            <section className='flex-[6] 2xl:p-10 xl:p-6 p-5 relative'>

                <span className='right-0 left-0 fixed top-0 w-full xl:h-[120px] h-[110px] bg-panel-white z-30'></span>

                <div className='flex items-center ch:flex-1 2xl:gap-10 gap-10 sticky top-10 z-40'>

                    <div onKeyDown={e => e.key == 'Enter' && globalSearch()} className='flex items-center justify-between text-[#969BA0] bg-white rounded-xl h-[56px] px-2 shadow-sm'>
                        <input
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            className='bg-transparent px-4 h-full placeholder:font-peyda w-full'
                            placeholder='جستجو کن'
                            type="text"
                        />
                        <CiSearch onClick={globalSearch} className='size-8 cursor-pointer' />
                    </div>

                    <div className='flex items-center justify-end'>

                        <Notifications notifications={notifications} />

                        <div className='inline-block border h-px rotate-90 border-[#D0D6DE] px-6'></div>

                        <div className='flex items-center gap-4'>
                            <div className='text-[16px] xl:block font-peyda hidden text-panel-darkTitle'>مرحباً <span className='text-[15px] font-bold px-px'>{nameLastName || username}</span></div>
                            <Link href={'/profile'} className='size-[56px] bg-white flex-center rounded-full shadow-sm'>
                                {
                                    profile
                                        ?
                                        <Image src={profile} alt='admin profile' width={200} height={200} className='object-cover size-full rounded-full' />
                                        :
                                        <RiAdminFill className='flex-center size-3/5 text-panel-darkTitle' />
                                }
                            </Link>
                        </div>

                    </div>
                </div>

                <section className='pt-[35px]'>{children}</section>

            </section>
        </div >
    )
}

export default Layout;
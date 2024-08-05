import { IoSearch } from "react-icons/io5";
import { CiShoppingBasket } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { MdPhoneInTalk } from "react-icons/md";
import Category from "./Category";
import SideMenu from "./SideMenu";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAppSelector } from "@/Hooks/useRedux";
import { FaComputer } from "react-icons/fa6";
import { IoIosLaptop } from "react-icons/io";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { PiHeadphones } from "react-icons/pi";
import { GiConsoleController } from "react-icons/gi";
import prefix from "@/config/prefix";


export default function Header() {

    const [sideMenuDataToShow, setSideMenuDataToShow] = useState<"basket" | "sideMenu">("sideMenu")
    const navigate = useRouter()
    const textInputElem = useRef<HTMLInputElement | null>(null)
    const { isLogin, data } = useAppSelector(state => state.userSlice)
    const { BasketItem, Notification } = useAppSelector(state => state.userSlice.relatedData) || []
console.log("BASKET--🔷️🔶️🔷️🔶️🔷️🔶️🔷️🔶️🔷️🔶️🔷️🔶️🔷️🔶️🔷️🔶️🔷️🔶️->" , BasketItem)
    const menusShown = useAppSelector(state => state.globalVarsSlice.isScrolledDown)

    const globalSearch = () => {
        const searchValue = textInputElem.current?.value.trim()
        searchValue?.length && navigate.push(`/search/${searchValue}`)
    }

    return (
        <section className="z-[150] fixed left-0 right-0 w-full shadow-regular">

            {
                data?.role == 'ADMIN'
                    ?
                    <Link
                        href={'/admin-panel'}
                        className="p-1 fixed z-50 left-0 rounded-br-xl border-r-2 border-dark-red px-2 bg-[#393A3D] top-20 text-[15px] text-description-text cursor-pointer font-peyda"
                    >داشبرد
                    </Link>
                    :
                    null
            }

            {/* for large screens */}
            <div className="hidden md:block bg-secondary-black py-4">

                <div className="container flex items-center m-auto relative justify-between w-full">
                    <Link href="/" className="max-w-[200px] relative">
                        <Image
                            alt="pc-kala-shop"
                            src={`${prefix}/images/home/title.webp`}
                            width={300}
                            height={100}
                            priority
                            className="object-cover"
                            quality={85}
                        />
                    </Link>

                    <SideMenu
                        changeTypeFn={() => {
                            setSideMenuDataToShow("sideMenu")
                            return true
                        }}
                        dataToShow={sideMenuDataToShow} />

                    <div className="flex-center text-white gap-2 ch:ml-auto bg-primary-black p-2 rounded-md  w-2/5 ">
                        <IoSearch className={"cursor-pointer size-6"} onClick={globalSearch} />
                        <input onKeyDown={e => e.key == "Enter" && globalSearch()}
                            ref={textInputElem}
                            className=" bg-transparent w-full text-sm " type="text"
                            placeholder="البحث عن منتج" />
                    </div>


                    <div className="flex-center gap-12 text-description-text ">
                        <div className="lg:flex items-center justify-center gap-1 hidden">
                            <div className="text-left">
                                <div>1234567</div>
                                <div className="text-blue-dark">1234567</div>
                            </div>
                            <MdPhoneInTalk className="size-7 text-blue-dark" />
                        </div>

                        <div className="flex-center gap-2 ch:ch:rounded-md ch:ch:bg-[#393A3D] ch:ch:size-9 ch:ch:p-2 relative">

                            <Link href={` ${isLogin ? '/profile' : '/login'} `}><FaRegUser /></Link>

                            {
                                Notification?.length || !isLogin
                                    ?
                                    <span onClick={() => navigate.push(isLogin ? '/profile' : '/login')} className="absolute size-2 rounded-full bg-gold right-1 top-px cursor-pointer animate-bounce"></span>
                                    : null
                            }

                            <div className="cursor-pointer" onClick={() => setSideMenuDataToShow("basket")}>
                                <div className="flex-center relative">
                                    {
                                        BasketItem?.length
                                            ?
                                            <span className="absolute -top-[10px] -left-[10px] p-1 rounded-full size-6 flex-center text-[12px] bg-primary-black">{BasketItem?.length}</span>
                                            :
                                            null
                                    }
                                    <CiShoppingBasket className="size-[35px] text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    menusShown && <div data-aos-duration="400" data-aos="zoom-in-left" className={`container text-white overflow-visible relative`}>
                        <ul className="flex items-center lg:gap-[36px] gap-8 mt-5 text-[14px]">
                            <Category
                                key={'كمبيوتر'}
                                title="كمبيوتر" screen="large"
                                Icon={<FaComputer className="size-5" />}
                                submenus={[
                                    { title: 'كمبيوترات العاب', path: '/products/category/pc?filter=gaming' },
                                    { title: 'كمبيوترات  اقتصادية', path: '/products/category/pc?filter=affordable' },
                                    { title: 'كمبيوترات طلاب', path: '/products/category/pc?filter=student' },
                                    { title: 'كمبيوتر رندرینک', path: '/products/category/pc?filter=rendering' },
                                    { title: 'كمبيوترات مكتبية', path: '/products/category/pc?filter=office' },
                                ]}
                            />
                            <Category
                                key={'لابتوب'}
                                title="لابتوب" screen="large"
                                Icon={<IoIosLaptop className="size-6" />}
                                submenus={[
                                    { title: 'لابتوبLonovo ', path: '/products/category/laptop/lenovo' },
                                    { title: 'لابتوبAsus ', path: '/products/category/laptop/asus' },
                                    { title: 'لابتوبMsi ', path: '/products/category/laptop/msi' },
                                    { title: 'لابتوبHp ', path: '/products/category/laptop/hp' },
                                    { title: 'لابتوبAcer ', path: '/products/category/laptop/acer' },
                                ]}
                            />
                            <Category
                                key={'قطعات'}
                                title="اكسسوارات" screen="large"
                                Icon={<HiOutlineCpuChip className="size-6" />}
                                submenus={[
                                    { title: 'ماذاربورد', path: '/products/category/parts/motherboard' },
                                    { title: 'وحدة المعالجة المركزية', path: '/products/category/parts/cpu' },
                                    { title: 'كرت شاشة', path: '/products/category/parts/gpu' },
                                    { title: 'رام', path: '/products/category/parts/ram' },
                                    { title: 'وحدة تبريد', path: '/products/category/parts/cooler' },
                                    { title: 'حافظه SSD', path: '/products/category/parts/ssd' },
                                ]}
                            />
                            <Category
                                key={'لوازم'}
                                title="قطع كمبيوتر" screen="large"
                                Icon={<PiHeadphones className="size-6" />}
                                submenus={[
                                    { title: 'ماوس', path: '/products/category/accessory/mouse' },
                                    { title: 'كيبورد', path: '/products/category/accessory/keyboard' },
                                    { title: 'سماعات اذن', path: '/products/category/accessory/headphone' },
                                    { title: 'كاميرات', path: '/products/category/accessory/webcam' },
                                ]}
                            />
                            <Category
                                key={'کنسول'}
                                title="الالعاب" screen="large"
                                Icon={<GiConsoleController className="size-6" />}
                                submenus={[
                                    { title: 'ps5', path: '/products/category/console/ps5' },
                                    { title: 'xbox', path: '/products/category/console/xbox' },
                                ]}
                            />
                        </ul>
                    </div>
                }

            </div>

            {/* for smaller screens */}
            <div className="md:hidden block bg-secondary-black sticky top-0 py-4">

                <div className="container flex items-center justify-between gap-4 w-full">

                    <SideMenu
                        changeTypeFn={() => { setSideMenuDataToShow("sideMenu"); return true }}
                        dataToShow={sideMenuDataToShow}
                    />

                    <Link href="/" className="max-w-[200px]">
                        <Image
                            alt="pc-kala-shop"
                            src={`${prefix}/images/home/title.webp`}
                            width={150}
                            height={50}
                            className="object-cover"
                            priority
                            quality={85}
                            blurDataURL="true"
                        />
                    </Link>

                    <div className="flex-center gap-12 text-description-text ">

                        <div
                            className="flex-center gap-2 ch:ch:rounded-md ch:ch:bg-[#393A3D] sm:ch:ch:size-9 ch:ch:size-8 relative ch:ch:p-2">
                            <Link href={` ${isLogin ? '/profile' : '/login'} `}><FaRegUser /></Link>

                            {
                                Notification?.length || !isLogin
                                    ?
                                    <span onClick={() => navigate.push(isLogin ? '/profile' : '/login')} className="absolute size-2 rounded-full bg-gold right-1 top-px cursor-pointer animate-bounce"></span>
                                    : null
                            }

                            <div onClick={() => setSideMenuDataToShow("basket")}>
                                <div className="flex-center relative">
                                    {
                                        BasketItem?.length
                                            ?
                                            <span className="absolute -top-[10px] -left-[10px] p-[3px] rounded-full size-[22px] flex-center text-[12px] bg-primary-black">{BasketItem?.length}</span>
                                            :
                                            null
                                    }
                                    <CiShoppingBasket className="size-[35px] text-white" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </section>
    )
}
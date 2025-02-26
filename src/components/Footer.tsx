import { CiLocationOn } from "react-icons/ci";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { BsInfoLg } from "react-icons/bs";
import { FaGithub, FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { VscSymbolRuler } from "react-icons/vsc";
import Button from "./Button";
import Image from "next/image";
import prefix from "@/config/prefix";

function Footer() {

    return (

        <section className="bg-secondary-black p-8 relative z-10">

            <div className="text-[12px]  text-description-text container space-y-2 ch:flex ch:items-center ch:gap-2">

                <div>
                    <CiLocationOn className="size-5 shrink-0 text-title-text" />
                    <p>طريق السلام، طيبة، المدينة المنورة 42353، المملكة العربية السعودية </p>
                </div>

                <div className="pb-6">
                    <MdOutlinePhoneAndroid className="size-5 text-title-text shrink-0" />
                    <p> معلومات التواصل : <span className="text-blue-white px-1">۰2222222</span> - <span className="text-blue-white px-1">011111111</span> - <span className="text-blue-white px-1">033333333</span>
                        <span className="pipe-sep relative mx-2"></span>ساعات العمل: ساعت ۱۰ الی ۱۹

                        {/* <span className="pipe-sep relative mx-2"></span>تهران، میدان ولیعصر، خیابان ولیعصر،خیابان ولدی (انبار مرکزی) */}
                        
                        
                        </p>
                </div>

                <span className="w-full h-[1px] bg-gold/10"></span>

                <div className=" flex flex-col lg:flex-row pt-6 pb-10 sm:pb-6">

                    <div className="flex-[2]  p-0 lg:pl-12">

                        <div className="flex-[2] flex items-center text-white gap-2">
                            <BsInfoLg className="size-6 bg-dark-red p-1 rounded-full" />
                            <p>نبذة عن متجر الكمبيوتر</p>
                        </div>

                        <p className="thin-title">متجر PC Kala تابع لمجموعة Lal Pham الهندسية التي تتمتع بخبرة تزيد عن 15 عامًا في مجال الإكسسوارات والمجال الرقمي، وذلك لتسهيل الأمر على عملائنا الأعزاء بناءً على أنشطتهم ومستوى كفاءة كل نظام وفقًا إلى النشاط؛ تجميع الأجزاء بطريقة مثالية وتقديمها للعملاء الأعزاء. حتى لا يواجهوا أي مشاكل في شراء نظام كامل ومناسب لعملهم والحصول على ما يريدون في أسرع وقت ممكن. كل جهودنا هي رضاكم وسهولة شراء نظام موثوق.</p>

                        <div className="flex items-center flex-col sm:flex-row gap-6 justify-center sm:justify-between mt-2">
                            <div className="flex items-center gap-3 ch:ch:size-4 ch:rounded-md ch:p-4 ch:bg-primary-black">
                                <Button fn={() => location.href = "https://t.me"} Icon={<FaTelegramPlane />} />
                                {/* <Button fn={() => location.href = "https://github.com/0xErfan"} Icon={<FaGithub />} /> */}
                                <Button fn={() => location.href = "https://www.instagram.com"} Icon={<FaInstagram />} />
                            </div>
                            <div className="flex items-center gap-1 text-blue-white">
                                <VscSymbolRuler className="size-5" />
                                <p>الأحكام والشروط</p>
                            </div>
                        </div>

                    </div>

                    {/* <div className="flex-1 h-full mr-auto mt-8 relative"><span className="fake-namad">Fake</span><Image width={1000} loading="lazy" height={1000} quality={100} className="h-[100%] mt-auto" src={`${prefix}/images/namads.png`} alt="" /></div> */}

                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-[#1F1F1F]">
                    <div className="container sm:flex-row flex flex-col text-center sm:text-start items-center justify-between text-[15px] py-3">
                        <p>Created with ❤️ by <a className="underline text-blue-white" target="_blank" href="">ٍSENIOR WEB</a></p>
                        <p>All Right Reserved ©2024</p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Footer;
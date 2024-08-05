import 'swiper/css';
import 'swiper/css/pagination';
import Button from "../components/Button";
import BlockTitle from "../components/BlockTitle";
import Product from "../components/Product";
import { FaComputer } from "react-icons/fa6";
import { BsLaptop } from 'react-icons/bs'
import { CiDiscount1 } from "react-icons/ci";
import { AiOutlinePartition } from "react-icons/ai";
import { BsCpu } from "react-icons/bs";
import { SwiperSlide } from 'swiper/react';
import Slider from "../components/Slider";
import Header from "../components/Header";
import connectToDB from '@/config/db';
import Image from 'next/image';
import ProductModel from '@/models/Product';
import { shuffleArray } from '@/utils';
import { productDataTypes, unknownObjProps } from '@/global.t';
import prefix from '@/config/prefix';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const DynamicFooter = dynamic(() => import('@/components/Footer'))

interface ProductsDataType {
    products: unknownObjProps<productDataTypes[]>
}

export default function Home({ products }: ProductsDataType) {

    const navigate = useRouter()
    const { laptops, pcs, parts } = products || {}

    return (

        <section className={`primary-bg overflow-x-hidden font-sans`}>

            <Header />

            <span className='pt-[80px] block'></span>
            <div className="overlay"></div>

            <div className="container flex-col-reverse lg:flex-row flex ch:flex-1 gap-8 my-12">

                <div>

                    <h3 className="thin-title mt-4">أفضل سعر</h3>
                    <h5 className="bold-title text-[40px] md:text-[52px]">شراء جميع انواع اللاب توب</h5>
                    <p className="thin-title">قم بشراء جميع أنواع ماركات أجهزة الكمبيوتر المحمول بأفضل الأسعار في السوق الإيرانية على موقع PC Kala، مجموعة متنوعة فريدة من الموديلات والسلاسل في السوق مع جميع أنواع التكوينات التي يطلبها المستخدمون والتي لن تجدها في أي موقع ويب آخر. يتوفر كل نوع من التكوينات بدءًا من ذاكرة الوصول العشوائي (RAM) المختلفة وحتى ذاكرة التخزين والرسومات والشاشة لجميع السلاسل الشائعة من أجهزة الكمبيوتر المحمولة الحديثة على موقع PC Kala. أي حاجة لديك فيما يتعلق بشراء جهاز كمبيوتر محمول، بالتأكيد سوف تحصل عليه بأفضل الأسعار على موقعنا.</p>

                    <div className="flex items-center justify-end mt-3">
                        <Button Icon={<BsLaptop />} filled={true}
                            fn={() => navigate.push("/products/category/laptop")}
                            text="شراء لابتوب بالتقسيط "
                        />
                    </div>

                </div>

                <div>
                    <Image
                        width={400}
                        quality={70}
                        priority
                        height={400}
                        className="w-full h-full object-cover"
                        src={`${prefix}/images/home/laptop.webp`}
                        alt="pc-kala"
                    />
                </div>

            </div>

            <div className="my-12">
                <BlockTitle Icon={<BsLaptop />} title="الأكثر مبيعا" url="/products/category/laptop" />
                <Slider>
                    {
                        [...laptops].map((data) => <SwiperSlide key={data._id}><Product key={data._id} useMotion={false} productData={{ ...data }} /></SwiperSlide>)
                    }
                </Slider>
            </div>

            <div className="container flex-col lg:flex-row flex ch:flex-1 gap-8 mt-36 mb-24">

                <div data-aos-duration="550" data-aos="zoom-in">
                    <Image
                        loading='lazy'
                        width={500}
                        height={500}
                        className="max-h-[480px] m-auto h-full  w-[200px]"
                        src={`${prefix}/images/home/case.webp`}
                        alt="pc-kala"
                    />
                </div>

                <div data-aos-duration="550" data-aos="zoom-in">

                    <h3 className="thin-title mt-4">تنوع رائع</h3>
                    <h5 className="bold-title text-[45px] md:text-[60px]">شراء جهاز كمبيوتر</h5>
                    <p className="thin-title">إذا كنت تتطلع إلى شراء جهاز كمبيوتر شخصي أو جهاز كمبيوتر بالتكوين الذي تريده، أو إذا كان من الصعب عليك اختيار الأجزاء معًا، فأنت بحاجة فقط إلى زيارة المتجر الفريد لأجهزة الكمبيوتر المجمعة PC Kala. مجموعة رائعة ومتنوعة من الاختيارات بناء على نوع المستخدم. من أجهزة كمبيوتر الألعاب لمحبي الألعاب إلى أجهزة الكمبيوتر المخصصة للأنشطة المنزلية والطلابية. تكمن قوتنا في اختيار الأجزاء الأكثر ملاءمة مع الضمان والسعر الرائع. فقط قم بزيارة متجر الكمبيوتر الخاص بنا!</p>

                    <div className="mt-3">
                        <Button
                            filled={true}
                            Icon={<FaComputer />}
                            fn={() => navigate.push('/products/category/pc')} text="سعر وشراء الكمبيوتر"
                        />
                    </div>

                    <div className="flex items-center gap-4 mt-8">
                        <Button filled={true} fn={() => navigate.push("/products/category/pc?filter=gaming")} text="نظام الألعاب" />
                        <Button filled={false} fn={() => navigate.push("/products/category/pc?filter=rendering")} text="نظام التقديم" />
                        <Button filled={true} fn={() => navigate.push("/products/category/pc?filter=student")} text="كمبيوترات طلاب" />
                    </div>
                </div>
            </div>

            <div className="my-12">

                <BlockTitle title="الأكثر مبيعا" url="/products/category/pc" Icon={<FaComputer />} />

                <Slider>
                    {
                        [...pcs].map(data => <SwiperSlide key={data._id}><Product key={data._id} productData={{ ...data }} /></SwiperSlide>)
                    }
                </Slider>

            </div>

            <div className="container flex-col-reverse lg:flex-row flex ch:flex-1 gap-8 lg:gap-3 mt-36 mb-24">

                <div data-aos-duration="550" data-aos="zoom-in" className="px-[29px]">

                    <h3 className="thin-title mt-4">اختيار ذكي</h3>
                    <h5 className="bold-title sm:text-[42px] text-[24px] lg:text-[32px]">شراء أجهزة الكمبيوتر واللابتوب بالتقسيط</h5>

                    <p className="thin-title">بالتأكيد، في ظل الظروف الاقتصادية الحالية، من الصعب شراء جهاز كمبيوتر محمول أو كمبيوتر نقداً. وبطبيعة الحال، نمت في السنوات الأخيرة العديد من الشركات والروابط التي تبيع المنتجات بالتقسيط. قسم البيع بالتقسيط لمنتجات الكمبيوتر الشخصي أصلي تمامًا وقد تم إنشاؤه للشراء بنسبة 100% دون أي مشاكل. كل ما عليك فعله هو إرسال طلبك لشراء لاب توب بالتقسيط أو كمبيوتر. يقوم فريق PC Kala المحترف بتنسيق جميع الخطوات معك وبذل كل جهد حتى تتمكن من شراء المنتج المطلوب في أقصر وقت ممكن.</p>

                    <div className="flex items-center justify-end mt-3">
                        <Button
                            Icon={<CiDiscount1 />}
                            filled
                            fn={() => navigate.push("/products/category/pc")}
                            text="شراء أجهزة الكمبيوتر المحمولة وأجهزة الكمبيوتر بالتقسيط"
                        />
                    </div>

                </div>
                <div data-aos-duration="550" data-aos="zoom-in" className=" ch:mr-auto h-[481px]">
                    <Image
                        loading='lazy'
                        className="sm:max-w-[450px] size-auto m-auto object-cover"
                        src={`${prefix}/images/home/ghesti.webp`}
                        width={500}
                        height={500}
                        quality={90}
                        alt="pc-kala"
                    />
                </div>
            </div>

            <div className="container flex-col lg:flex-row flex ch:flex-1 gap-8 mt-36 mb-24">

                <div data-aos-duration="550" data-aos="zoom-in">
                    <Image
                        loading='lazy'
                        width={500}
                        height={500}
                        className="m-auto lg:h-[600px] h-auto w-[500px]"
                        src={`${prefix}/images/home/parts.webp`}
                        alt="pc-kala"
                    />
                </div>

                <div data-aos-duration="550" data-aos="zoom-in" className="flex flex-col justify-center">

                    <h3 className="thin-title mt-4">القوة في يديك!</h3>
                    <h5 className="bold-title lg:text-[39px] text-[26px]">شراء جميع أنواع قطع الغيار والإكسسوارات</h5>

                    <p className="thin-title">شراء جميع أنواع قطع غيار الكمبيوتر وملحقاته مثل بطاقة الرسومات والمعالج المركزي وذاكرة الوصول العشوائي وذاكرة التخزين وإمدادات الطاقة والحالة وغيرها. جميع الأجزاء المعروضة على موقع PC Kala تتمتع بضمان صالح. من أهم مميزات منتجاتنا هو السعر الاستثنائي مقارنة بالسوق الإيراني. حتى تتمكن من العثور على أي قطعة تحتاجها وشرائها بأمان في مجموعة واسعة من متاجر قطع الغيار لدينا.</p>

                    <div className="flex items-center justify-end mt-3">
                        <Button
                            filled
                            Icon={<AiOutlinePartition />}
                            fn={() => navigate.push("/products/category/parts")}
                            text=" متجر قطع غيار واكسسوارات"
                        />
                    </div>
                </div>
            </div>

            <div className="my-6">

                <BlockTitle Icon={<BsCpu className="p-1" />} title="الأكثر مبيعا" url="/products/category/parts" />

                <Slider>
                    {
                        [...parts].map(data => <SwiperSlide key={data._id}><Product key={data._id} productData={{ ...data }} /></SwiperSlide>)
                    }
                </Slider>

            </div>

            <section>
                <div className="pt-[150px] size-60 lg:size-auto m-auto">
                    <Image
                        loading='lazy'
                        width={300}
                        height={300}
                        className="m-auto "
                        src={`${prefix}/images/home/pckala.webp`}
                        alt="pc-kala-logo"
                    />
                </div>

                <div
                    className="flex items-center justify-center ch:shrink ch:size-auto gap-0 lg:gap-8 xl:gap-24 mt-20 lg:mt-10">
                    <Image loading='lazy' width={300} height={300} alt='achivment' className="md:block hidden" src={`${prefix}/images/home/cup-1.webp`} />
                    <Image loading='lazy' width={300} height={300} alt='achivment' className="md:block hidden" src={`${prefix}/images/home/cup-2.webp`} />
                    <Image loading='lazy' width={300} height={300} alt='achivment' src={`${prefix}/images/home/cup-3.webp`} />
                    <Image loading='lazy' width={300} height={300} alt='achivment' src={`${prefix}/images/home/cup-4.webp`} />
                    <Image loading='lazy' width={300} height={300} alt='achivment' src={`${prefix}/images/home/cup-5.webp`} />
                </div>

            </section>

            <section data-aos-duration="550" data-aos="zoom-in" className=" mt-24 container lg:text-start text-center relative h-[700px]">

                <h3 className="bold-title sm:text-[40px] text-[32px] text-center">أفضل الخبراء</h3>

                <Image loading='lazy' width={300} height={300} alt='red-wave' src={`${prefix}/images/home/wave-red.webp`} className="sm:absolute md:flex hidden left-[19px] lg:left-60 top-48 w-[400px] h-[450px]"></Image>
                <Image loading='lazy' width={300} height={300} alt='red-wave' src={`${prefix}/images/home/wave-red.webp`} className="absolute inset-0 -z-[5] md:hidden block top-[50%] right-[50%] translate-x-[50%] size-2/3 brightness-[0.2] -translate-y-[50%]"></Image>

                <div className="lg:px-[200px] px-4 sm:px-[100px]">

                    <p className="text-description-text py-1 text-center text-sm leading-[31px]">لقد جمعنا أفضل الخبراء لنقدم لك الأفضل. موقع Pisi Kala، وهو إحدى المجموعات الفرعية لمجموعة Lal Pham الهندسية. وتتكون من أفضل الخبراء في مجال التكنولوجيا والمبيعات بين الشباب في بلدنا. هدفنا في هذه المسابقة هو الحصول على أقصى قدر من الرضا منكم أيها العملاء الأعزاء. نسعى كل يوم وكل لحظة إلى ابتكار أفكار جديدة وتقديم أفضل الخدمات لكم.</p>

                    <p className="text-white text-3xl font-bold text-center mb-2 lg:text-start mt-12">اتصل بنا</p>
                    <p className="bold-title text-[30px] sm:text-[40px]">أسرع وسيلة للاتصال</p>
                    <p className="sm:text-[60px] text-[40px] xl:text-[90px] text-white">۰۲۱-۱۲۳۴۵۶۷۸۹</p>
                    <p className="bold-title text-[30px] sm:text-[40px]">۰۳۱-۹۸۷۶۵۴۳۲۱</p>

                </div>
            </section>

            <DynamicFooter />

        </section>
    )
}

export async function getStaticProps() { // static rendering(SSG) for main page static products.

    await connectToDB()

    let products: unknownObjProps<ProductsDataType[]> = {}

    products.laptops = await ProductModel.find({ category: 'laptop' }).limit(8)
    products.pcs = await ProductModel.find({ category: 'pc' }).limit(8)
    products.parts = shuffleArray(await ProductModel.find({ category: 'parts' }), 8)

    return {
        props: {
            products: JSON.parse(JSON.stringify(products))
        },
        revalidate: 120
    }
}
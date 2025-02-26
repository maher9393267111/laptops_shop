import { Secret, sign, verify } from "jsonwebtoken"
import toast from "react-hot-toast"
import { categories, productDataTypes, unknownObjProps, userDataTypes } from "./global.t"
import { userUpdater } from "./Redux/Features/globalVarsSlice"
import { store } from "./Redux/store"
import { S3 } from "aws-sdk"
import { PutObjectRequest } from "aws-sdk/clients/s3"

const ACCESSKEY = "rfpsaen58kka9eso"
const SECRETKEY = "f8eea594-08f0-40de-bef2-6ef252a88cae"
const ENDPOINT = "storage.iran.liara.space"
const BUCKET = 'pc-kala'


// // prepare S3 client
// const BUCKET = "dash93";
// const region = "us-east-1";
// const ACCESSKEY = "DO00PHUUAT4VXQF27H6N";
// // "DO00M9XA6DJ9P9Y4UWFT";
// const SECRETKEY = "P1YyD/tvykl7hpLKBF/g3Ff1KN2yJOunrRlWSXGRa5s";
// // "fcWJxA4nn0r5yNKUi1011UzQ66FPMO6Lt8UEuGWSypE";

// const ENDPOINT = "https://nyc3.digitaloceanspaces.com";
// const cdnEndpoint = "https://dash93.nyc3.cdn.digitaloceanspaces.com";



type addProductFunctionProps<T> = (userID: string, productID: string, count?: number, dispatch?: typeof store.dispatch, productServices?: unknownObjProps<number>) => Promise<T>

export interface productOffTimerProps {
    hours: number | string
    days: number | string
    minutes: number | string
    seconds: number | string
}



interface FetchOptions {
    method?: 'POST' | 'DELETE' | 'PUT'
    body?: unknownObjProps<unknown>
}

type FetchResponse<T> = {
    data: T | null;
    error: object | null
};

export interface inputValidationProps {
    title: string
    isValid: boolean
    errorMessage: string
}

const getTimer = (date?: string) => {

    const currentDate = new Date();
    const endOfTimer = date || new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0);

    const differenceBetweenDates = (endOfTimer instanceof Date ? endOfTimer.getTime() : new Date(endOfTimer).getTime()) - currentDate.getTime();
    const secondsRemaining = Math.floor(differenceBetweenDates / 1000);

    const hours = Math.floor(secondsRemaining / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((secondsRemaining % 3600) / 60).toString().padStart(2, "0");
    const seconds = (secondsRemaining % 60).toString().padStart(2, "0");

    return {
        days: Math.floor(differenceBetweenDates / (60 * 60 * 24 * 1000)).toString().padStart(2, "0"),
        hours,
        minutes,
        seconds
    } satisfies productOffTimerProps;
}

const fetchData = async<T>(url: string, options?: FetchOptions): Promise<FetchResponse<T>> => {

    let response: FetchResponse<T> = { data: null, error: null, }

    try {

        // different options for different request  
        let res = options?.method ?
            await fetch(url, { method: options.method, body: JSON.stringify(options.body), headers: { 'Content-Type': 'application/json' } })
            :
            await fetch(url);

        if (res.ok) {
            response.data = await res.json();
        } else throw new Error(`HTTP error with ${res.status} code!`);

    } catch (error) { response.error = error!, console.log(error) }

    return response;
};

const showToast = (status: boolean, message: string, duration: number = 2500) => {

    toast[status ? 'success' : 'error'](message,
        {
            position: "top-right",
            duration,
            style: {
                display: 'flex',
                flexDirection: 'row-reverse',
                alignItems: 'center',
                fontFamily: 'peyda',
                backgroundColor: '#292A2D',
                color: '#e3e3e3',
                position: 'relative',
                top: '50px',
                fontSize: '17px',
                padding: '9px',
                border: `2px solid #${status ? '16723A' : 'FD0019'}`,
                borderRadius: '6px',
                zIndex: '999999',
                wordSpacing: '4px'
            }
        }
    )
}

const tokenDecoder = (token: string) => {
    try {
        return verify(token, process.env.secretKey as Secret)
    } catch (error) {
        return false
    }
}

const tokenGenerator = (data: object, days: number = 7) => sign({ email: data }, process.env.secretKey as Secret, { expiresIn: 60 * 60 * 24 * days })

const isEmptyInput = (payload: {}, props: string[]) => {

    const expectedProps = props;
    const actualProps = Object.keys(payload);
    const values = Object.values(payload)

    const containAllElements = expectedProps.every(val => actualProps.includes(val))

    if (!containAllElements) return true

    if (values.some(value => { if (!String(value).trim().length) return true })) return true // check for all value of properties not to be empty

    if (expectedProps.some(prop => !actualProps.includes(prop))) true

    return false
};

const inputValidations = (title: string, value: string, confirmPassword?: string): inputValidationProps | undefined => {

    const inputRules = [
        { title: 'username', isValid: value.length > 3 && value.length < 20, errorMessage: 'طول اسم المستخدم باید بیشتر از ۳ و کمتر از ۲۰ کاراکتر باشد' },
        { title: 'email', isValid: /^[\w-]+@[a-zA-Z\d-]+\.[a-zA-Z]{2,}$/.test(value), errorMessage: 'الايميل نامعتبر است' },
        { title: 'password', isValid: value.length < 20 && value.length > 7, errorMessage: 'طول رمز عبور باید بیشتر از ۷ و کمتر از ۲۰ کاراکتر باشد' },
        { title: 'confirmPassword', isValid: Boolean(value === confirmPassword), errorMessage: 'رمز تایید با رمز وارد شده تناقض دارد' },
        { title: 'nationalCode', isValid: value.length == 10 && !isNaN(+value), errorMessage: 'الرمز الدولي یک عدد ده رقمی است' },
        { title: 'phoneNumber', isValid: /^09\d{9}$/.test(value), errorMessage: 'رقم الهاتف نامعتبر است' },
        { title: 'nameLastName', isValid: value.length > 6, errorMessage: 'الاسم الأول والاسم الأخير کوتاه است' },
        { title: 'changePass', isValid: value.length < 20 && value.length > 7, errorMessage: 'طول رمز عبور باید بیشتر از ۷ و کمتر از ۲۰ کاراکتر باشد' },
    ]

    return inputRules.find(inputTitle => inputTitle.title == title)
}

const shuffleArray = (array: never[], sliceCount?: number) => {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Using destructuring assignment for swapping
    }

    if (sliceCount) { return array.slice(0, sliceCount) } else return array
}

const engCategoryToPersian = (category: categories) => {

    let translatedCategory = null

    switch (category) {
        case 'accessory': { translatedCategory = 'اكسسوارات'; break }
        case 'console': { translatedCategory = 'الالعاب'; break }
        case 'laptop': { translatedCategory = 'لابتوب'; break }
        case 'parts': { translatedCategory = 'قطع الكمبيوتر'; break }
        case 'pc': { translatedCategory = 'كمبيوتر'; break }
    }

    if (!translatedCategory) {
        switch (category) {
            case 'اكسسوارات': { translatedCategory = 'accessory'; break }
            case 'الالعاب': { translatedCategory = 'console'; break }
            case 'لابتوب': { translatedCategory = 'laptop'; break }
            case 'قطع الكمبيوتر': { translatedCategory = 'parts'; break }
            case 'كمبيوتر': { translatedCategory = 'pc'; break }
        }
    }

    return translatedCategory;
}

const engSubCategoryToPersian = (category: string) => {

    let translatedSubCategory = null

    switch (category) {
        case 'mouse': { translatedSubCategory = 'ماوس'; break }
        case 'motherboard': { translatedSubCategory = 'ماذربورد'; break }
        case 'keyboard': { translatedSubCategory = 'كيبورد'; break }
        case 'headphone': { translatedSubCategory = 'سماعات اذن'; break }
        case 'webcam': { translatedSubCategory = 'كاميرات'; break }
        case 'cpu': { translatedSubCategory = 'وحدة معالجة مركزية'; break }
        case 'gpu': { translatedSubCategory = 'كروت شاشة' ; break }
        case 'ram': { translatedSubCategory = 'رام'; break }
        case 'cooler': { translatedSubCategory = 'وحدة تبريد'; break }
        case 'ssd': { translatedSubCategory = 'كروت ذاكرة'; break }
    }

    if (!translatedSubCategory) {
        switch (category) {
            case 'ماوس': { translatedSubCategory = 'mouse'; break; }
            case 'ماذاربورد': { translatedSubCategory = 'motherboard'; break; }
            case 'كيبورد': { translatedSubCategory = 'keyboard'; break; }
            case 'سماعات اذن': { translatedSubCategory = 'headphone'; break; }
            case 'كاميرات': { translatedSubCategory = 'webcam'; break; }
            case 'وحدة معالجة مركزية': { translatedSubCategory = 'cpu'; break; }
            case 'كروت شاشة': { translatedSubCategory = 'gpu'; break; }
            case 'رام': { translatedSubCategory = 'ram'; break; }
            case 'وحدة تبريد': { translatedSubCategory = 'cooler'; break; }
            case 'حافظه SSD': { translatedSubCategory = 'ssd'; break; }
        }
    }

    return translatedSubCategory;
}

const sharePage = (url: string) => {

    if (navigator.share) {
        navigator.share({
            title: 'Share Image URL',
            text: 'Check out this product!',
            url
        })
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.error('Error sharing:', error));
    } else {
        console.error('Web Share API not supported');
    }
}

const itemsSorter = (type: string, items: never[]) => {

    let sortedProducts: productDataTypes[] = [...items]

    switch (type) {
        case 'well-sell': { sortedProducts = sortedProducts.sort((a, b) => b.customers - a.customers); break }
        case 'cheap': { sortedProducts.sort((a, b) => a.price - b.price); break }
        case 'exp': { sortedProducts.sort((a, b) => b.price - a.price); break }
        default: { break }
    }

    return sortedProducts;
}

const addWish = async (creator: string, productID: string) => {

    try {
        const res = await fetch('/api/wish/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ creator, productID })
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        showToast(res.ok, data.message, 2000)

    } catch (err) {
        console.log(err)
        showToast(false, err as string)
    }
}

const convertNumbers2English = (string: any) => {

    return string.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (c: string) => {
        return c.charCodeAt(0) - 1632
    }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (c: string) => {
        return c.charCodeAt(0) - 1776
    });
}

const removeProductFromBasket = async (productID: string, userID: string) => {

    try {
        const res = await fetch('/api/basket/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productID, userID })
        })

        const data = await res.json()

        showToast(res.ok, data.message, 2000)

    } catch (err) {
        console.log(err)
        showToast(false, err as string)
    }
}

const addProductToBasket: addProductFunctionProps<unknown> = async (userID, productID, count, dispatch, productServices = { '(ضمان المنتج لمدة 18 شهرًا)': 0 }) => {

    const res = await fetch('/api/basket/add', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, productID, count: count ?? null, services: productServices })
    })

    const finalData = await res.json()

    showToast(res.ok, finalData.message)
    if (res.ok) dispatch!(userUpdater())
}

const totalPriceCalculator = (price: number, discount: number, count: number, services: unknownObjProps<number>, withDiscount: boolean = true) => {

    const priceAfterDiscount = withDiscount ? price - (price * (discount / 100)) : price
    const servicesPrice = services ? Object.values(services).reduce((prev, next) => prev + next, 0) : 0

    const totalPrice = ((priceAfterDiscount + servicesPrice) * count) - (servicesPrice * (count - 1))

    return totalPrice < 0 ? 0 : totalPrice
}

const authUser = async ({ isFromClient = false, cookie }: { isFromClient?: boolean, cookie?: string }): Promise<userDataTypes | null | undefined> => {

    try {
        const res = await fetch(`${isFromClient ? '' : process.env.NEXT_PUBLIC_BASE_PATH}/api/auth/me`, isFromClient ? {} : {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cookie)
        })

        if (!res.ok) return null;

        const userData = await res.json()

        return userData;
    }
    catch (error) {
        console.log(error)
    }
}

const getPastDateTime = (last: 'MONTH' | 'WEEK' | 'DAY' | number): Date => {

    const now = new Date();

    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)

    let daysBack: number;
    if (typeof last === 'number') {
        daysBack = last;
    } else {
        switch (last) {
            case 'MONTH':
                daysBack = 30;
                break;
            case 'WEEK':
                daysBack = 7;
                break;
            case 'DAY':
                daysBack = 1;
                break;
            default:
                throw new Error(`Invalid unit: ${last}`);
        }
    }

    const millisecondsBack = daysBack * 24 * 60 * 60 * 1000;

    return new Date(now.getTime() - millisecondsBack);
}


const roundedPrice = (price: number): string => {

    const priceLength = price.toString().length
    const visiblePartOfPrice = price.toString().slice(0, priceLength >= 10 ? 4 : 3)

    return Number(visiblePartOfPrice).toLocaleString() + (priceLength >= 10 ? 'MY' : 'M')
}

const getCurrentPersianWeekday = (day: number) => {
    const persianDays = ['الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return persianDays[day];
}

const getStartOfWeek = (): Date => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1);

    console.log(new Date(currentDate.setDate(diff)))
    console.log(new Date())

    return new Date(currentDate.setDate(diff));
}

const imageUploader = async (file: File): Promise<string | Error> => {

    let encodedFileName = file.name?.replace(/[\?\=\%\&\+\-\.\_\s]/g, '_')
    encodedFileName = encodedFileName?.slice(encodedFileName.length - 30)

    try {

        const s3 = new S3({

       

            accessKeyId: ACCESSKEY,
            secretAccessKey: SECRETKEY,
            endpoint: ENDPOINT,
        });




        const params = {
            Bucket: BUCKET,
            Key: encodeURIComponent(encodedFileName),
            Body: file,
        };

        await s3.upload(params as PutObjectRequest).promise();

        const permanentSignedUrl = s3.getSignedUrl('getObject', {
            Bucket: BUCKET,
            Key: encodeURIComponent(encodedFileName),
            Expires: 3153600000
        });

        return permanentSignedUrl;

    } catch (error) { throw new Error('failed to fech') }
};

const handleDeleteFile = async (name: string) => {

    let formattedFileName = name.replace('https://pc-kala.storage.iran.liara.space/', '')
    formattedFileName = formattedFileName.slice(0, formattedFileName.lastIndexOf('?'))

    try {

        const s3 = new S3({
            accessKeyId: ACCESSKEY,
            secretAccessKey: SECRETKEY,
            endpoint: ENDPOINT,
        });

        await s3.deleteObject({ Bucket: BUCKET, Key: formattedFileName }).promise();

    } catch (error) {
        console.error('Error deleting file: ', error);
        showToast(false, 'خطا در حذف تصویر')
    }
};

export {
    getTimer,
    fetchData,
    showToast,
    tokenDecoder,
    tokenGenerator,
    isEmptyInput,
    inputValidations,
    shuffleArray,
    engCategoryToPersian,
    engSubCategoryToPersian,
    sharePage,
    itemsSorter,
    addWish,
    convertNumbers2English,
    removeProductFromBasket,
    addProductToBasket,
    totalPriceCalculator,
    authUser,
    getPastDateTime,
    roundedPrice,
    getCurrentPersianWeekday,
    getStartOfWeek,
    imageUploader,
    handleDeleteFile
}
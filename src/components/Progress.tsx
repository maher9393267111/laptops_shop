import { useEffect, useState } from "react"
import { CgFileDocument } from "react-icons/cg"
import { CiShoppingBasket } from "react-icons/ci";
import { CiDeliveryTruck } from "react-icons/ci";


const Progress = () => {

    const [routeParam, setRouteParam] = useState("")

    useEffect(() => { setRouteParam(location.pathname) }, [])

    const progressPercentage: number = routeParam == '/checkout' ? 2 : routeParam.includes('/transactionDetails') ? 3 : 1

    return (
        <div className="flex items-center justify-evenly gap-12 relative mb-12 container text-[12px]">

            <span style={{ width: `${33.333 * progressPercentage}%` }} className="absolute rounded-sm animate-pulse right-0 h-4 z-20 bg-blue-white top-4"></span>
            <span className="absolute rounded-sm w-full right-0 h-4 z-10 bg-secondary-black top-4"></span>

            <div className="flex items-center flex-col gap-2 z-30">
                <CiShoppingBasket className="size-12 rounded-md text-dark-red/90 p-2 bg-secondary-black" />
                <p className="text-description-text transition-all hover:text-white">عربة التسوق</p>
            </div>
            <div className="flex items-center flex-col gap-2 z-30">
                <CgFileDocument className="size-11 rounded-md text-dark-red/90 p-2 bg-secondary-black" />
                <p className="text-description-text transition-all hover:text-white">بيانات الدفع</p>
            </div>
            <div className="flex items-center flex-col gap-2 z-30">
                <CiDeliveryTruck className="size-12 rounded-md text-dark-red/90 p-2 bg-secondary-black" />
                <p className="text-description-text transition-all hover:text-white">إكمال الطلب</p>
            </div>

        </div>
    )
}

export default Progress
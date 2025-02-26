import { useAppDispatch } from "@/Hooks/useRedux"
import { userUpdater } from "@/Redux/Features/globalVarsSlice"
import Loader from "@/components/Loader"
import { isEmptyInput, showToast } from "@/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"

const Login = () => {

    const [loginForm, setLoginFrom] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(false)
    const navigate = useRouter()
    const dispatch = useAppDispatch()


    const formUpdater = (prop: string, value: string) => setLoginFrom({ ...loginForm, [prop]: value })

    const formSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (isEmptyInput(loginForm, ['payload', 'password'])) return showToast(false, 'لطفا تمام فیلد هارا پر کنید')

        setLoading(true)

        try {

            const res = await fetch('/api/auth/login', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm)
            })

            const data = await res.json()
            showToast(res.ok, data.message, 3000)

            if (res.ok) {
                setLoginFrom({})
                dispatch(userUpdater())
                setTimeout(() => { navigate.replace('/') }, 1500);
            }

        }
        catch (error) { showToast(false, String(error)) }
        finally { setLoading(false) }
    }

    return (

        <section className="flex-center h-screen px-5 bg-title-text">

            <Link className="py-3 px-5 font-peyda absolute top-8 bg-black text-white rounded-md left-8" href="/">بازگشت</Link>

            <div className="max-w-[400px] m-auto shadow-regular w-full overflow-hidden rounded-[47px] p-2">

                <div className="h-[200px] bg-black rounded-t-[40px] text-center flex-center"><div className="text-[30px] pb-16 text-white font-peyda">ورود</div></div>

                <form className="bg-title-text relative pt-12 rounded-tl-[40px] px-2 bottom-12">

                    <div className="flex flex-col p-2 text-[13px] gap-2">
                        <label className="text-black mr-6 font-bold" htmlFor="name">اسم المستخدم یا الايميل</label>
                        <input
                            value={loginForm?.payload ?? ''}
                            onChange={e => formUpdater("payload", e.target.value)}
                            className="p-3 input-shadow rounded-lg placeholder:text-[12px] text-[15px] text-gray-500 outline-none"
                            type="text"
                            placeholder="اسم المستخدم / الايميل" />
                    </div>

                    <div className="flex flex-col p-2 text-[13px] gap-2">
                        <label className="text-black mr-6 font-bold" htmlFor="name">رمز عبور</label>
                        <input
                            value={loginForm?.password ?? ''}
                            onChange={e => formUpdater("password", e.target.value)}
                            className="p-3 input-shadow rounded-lg placeholder:text-[12px] text-[15px] text-gray-500 outline-none"
                            type="text"
                            placeholder="رمز خود را وارد کنید" />
                    </div>

                    <button
                        disabled={loading}
                        onClick={formSubmit}
                        className={`px-2 text-white bg-black rounded-xl text-center text-xl font-peyda p-3 w-full ${!loading ? 'cursor-pointer ch:cursor-pointer' : 'cursor-wait ch:cursor-wait'}  mt-12`}
                        name="login"
                        >
                        {
                            !loading
                                ?
                                <div>ورود</div>
                                :
                                <Loader />
                        }

                    </button>
                </form>

                <div className="text-[13px] m-auto pb-2 text-gray-600 text-center">حساب کاربری ندارید؟ <Link className="text-black underline font-bold" href="/register">ثبت نام کنید</Link></div>
            </div>

        </section>
    )
}

export default Login
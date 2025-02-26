import { useState } from "react"
import { CiEdit } from "react-icons/ci";
import Button from "./Button";
import { convertNumbers2English, inputValidationProps, inputValidations, showToast } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/Hooks/useRedux";
import { userDataTypes } from "@/global.t";
import Loader from "./Loader";
import { userUpdater } from "@/Redux/Features/globalVarsSlice";

interface inputProps {
    title: string
    inputValue: string | number
    name: string
    readOnly?: boolean
    editAble?: boolean
    dataEditorCloser: () => void
    editToggle: () => void
}

const UserDataUpdater = ({ name, readOnly, title, inputValue, editAble = true, editToggle, dataEditorCloser }: inputProps) => {

    const [value, setValue] = useState(inputValue)
    const [loading, setLoading] = useState(false)
    const [isPasswordValid, setIsPasswordValid] = useState(false)

    const dispatch = useAppDispatch()
    const { _id }: Partial<userDataTypes> = useAppSelector(state => state.userSlice.data || { _id: '' })


    const validateValueAndUpdate = async () => {

        const data: inputValidationProps | undefined = inputValidations(name, value as string)

        if (!data?.isValid) return showToast(false, data?.errorMessage as string)

        if (value == inputValue) return

        if (name == 'changePass') { // this 'if' statement is just for change password validations

            setLoading(true)

            const res = await fetch('/api/auth/changePassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [isPasswordValid ? 'password' : 'compare']: value, _id }) // 'password' for changing it and 'compare' to check the user input
            })
            const data = await res.json()

            if (!isPasswordValid) {

                if (res.status == 200) { // compare result is true(user inserted the right password)
                    setIsPasswordValid(true)
                    setValue('')
                } else {
                    showToast(res.ok, data.message)
                    setIsPasswordValid(false)
                }

            } else {
                // here user password changed successfully
                showToast(res.ok, data.message)

                if (res.status == 200) {
                    setIsPasswordValid(false)
                    dataEditorCloser()
                    setValue('')
                }
            }

            setLoading(false)
            return
        }

        setLoading(true)

        try {

            const res = await fetch('/api/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prop: name, value, _id })
            })

            const { message } = await res.json()

            if (!res.ok) {
                showToast(false, message)
                setLoading(false)
                return
            }

            setTimeout(() => {
                showToast(res.status == 200, message);
                setValue(value)
                dispatch(userUpdater())
                dataEditorCloser()
                setLoading(false)
            }, 600);

        } catch (err) { showToast(false, 'خطا - از اتصال به اینترنت اطمینان منید'); setLoading(false) }
    }

    return (
        <>
            {
                readOnly
                    ?
                    <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col gap-2 text-[12px] text-description-text p-3">
                            <label className="text-[13px]">{title}</label>
                            <div className={`text-[14px] text-white py-1`}>{value}</div>
                        </div>
                        {editAble && <CiEdit onClick={editToggle} className="size-7 cursor-pointer" />}
                    </div>
                    :
                    <div className="flex flex-col gap-2 text-[12px] text-description-text px-3 overflow-hidden pb-4">
                        <label className="text-[13px]">{title}</label>
                        <div className="flex items-center justify-between gap-3">
                            <input
                                data-aos-duration="550" data-aos="fade-left"
                                className={`appearance bg-primary-black flex-[3] outline-none rounded-md p-3 text-white`}
                                type="input"
                                value={value}
                                placeholder={name == 'changePass' ? isPasswordValid ? 'رمز جدید را وارد کنید' : 'رمز عبور فعلی را وارد کنید' : ''}
                                name={name}
                                onChange={e => setValue(convertNumbers2English(e.target.value))}
                                onKeyDown={e => e.key == 'Enter' && validateValueAndUpdate()}
                            />
                            <div data-aos-duration="550" data-aos="fade-right" className="flex-1 flex items-center gap-1 ch:flex-1 w-full">
                                <Button fn={() => { dataEditorCloser(), setValue(inputValue) }} text="الغاء" size="sm" />
                                <Button text={loading ? '' : 'تایید'} fn={validateValueAndUpdate} Icon={loading ? <Loader size="sm" /> : <></>} filled size="sm" />
                            </div>
                        </div>
                    </div>
            }

        </>
    )
}

export default UserDataUpdater;
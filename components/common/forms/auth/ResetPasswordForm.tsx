import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { CountDown } from "../../CountDownComponent";

export const ResetPassword = ({
    showPassword,
    Password,
    setPassword,
    setPasswordCheck,
    togglePasswordVisibility,
    setShowPassword,
    showPasswordCheck,
    PasswordCheck,
    setShowPasswordCheck,
    handleResetPassword,
}: ResetPasswordProps) => {
    return (
        <>
            <div className={`pt-4 pl-4`}>
                <span className="text-2xl">Đổi mật khẩu</span>
            </div>
            <form onSubmit={handleResetPassword} className="w-full p-4">
                <div className="relative w-full max-w-md pt-1">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder=" "
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="peer w-full border border-gray-300 rounded-lg pl-10 pr-4 pt-5 pb-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <FontAwesomeIcon
                        onClick={() =>
                            togglePasswordVisibility(setShowPassword)
                        }
                        icon={showPassword ? faLockOpen : faLock}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 peer-focus:text-blue-500 transition-colors"
                    />
                    <label
                        htmlFor="password"
                        className={`absolute left-10 top-2 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 pointer-events-none`}
                    >
                        Mật khẩu
                    </label>
                </div>
                <div className="relative w-full max-w-md pt-1">
                    <input
                        type={showPasswordCheck ? "text" : "password"}
                        placeholder=" "
                        value={PasswordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                        className="peer w-full border border-gray-300 rounded-lg pl-10 pr-4 pt-5 pb-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <FontAwesomeIcon
                        onClick={() =>
                            togglePasswordVisibility(setShowPasswordCheck)
                        }
                        icon={showPasswordCheck ? faLockOpen : faLock}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 peer-focus:text-blue-500 transition-colors"
                    />
                    <label
                        htmlFor="password"
                        className={`absolute left-10 top-2 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 pointer-events-none`}
                    >
                        Xác nhận mật khẩu
                    </label>
                    {PasswordCheck !== Password && (
                        <div className={`absolute right-2 top-4 text-red-500`}>
                            !
                        </div>
                    )}
                </div>
                <div className="pt-4">
                    <div className="flex justify-center items-end pt-2 pb-4 text-xl">
                        <span className="pr-1">Thời gian còn lại:</span>
                        <span className="text-red-500">
                            <CountDown m={5} />
                        </span>
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            className="w-fit pl-8 pr-8 pt-2 pb-2 rounded-4xl border-solid border hover:bg-blue-200 hover:text-black"
                            type="submit"
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

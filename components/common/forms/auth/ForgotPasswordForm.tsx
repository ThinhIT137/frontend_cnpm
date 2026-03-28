import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ForgotPasswordProps } from "@/types/AuthProps/ForgotPasswordProps";

export const ForgotPassword = ({
    resForgot,
    EmailForgot,
    setEmailForgot,
    handleForgot,
    setlogin,
}: ForgotPasswordProps) => {
    return (
        <>
            <div className={`pt-4 pl-4`}>
                <span className="text-2xl">Quên Mật Khẩu</span>
            </div>
            {resForgot !== "" && (
                <>
                    <div className="pl-4">{resForgot}</div>
                </>
            )}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleForgot();
                }}
                className="w-full p-4"
            >
                <div className="relative w-full">
                    <input
                        className="peer w-full border border-gray-300 rounded-lg pl-3 pr-4 pt-5 pb-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        type="text"
                        placeholder=" "
                        value={EmailForgot}
                        onChange={(e) => setEmailForgot(e.target.value)}
                    />
                    <label
                        htmlFor="password"
                        className={`absolute left-3 top-1 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 pointer-events-none`}
                    >
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span className="pl-1">Email</span>
                    </label>
                </div>
                <div className="pt-4">
                    <div className="flex justify-center items-center">
                        <button
                            className="w-fit pl-8 pr-8 pt-2 pb-2 rounded-4xl border-solid border hover:bg-blue-200 hover:text-black"
                            type="submit"
                        >
                            Gửi mã
                        </button>
                    </div>
                    <div className="flex justify-center items-end pt-2">
                        <button
                            className="text-blue-300 font-bold hover:text-blue-500"
                            onClick={() => {
                                setlogin("login");
                            }}
                        >
                            Đăng nhập
                        </button>
                        <span className="pl-1 pr-1">hoặc</span>
                        <button
                            className="text-blue-300 font-bold hover:text-blue-500"
                            onClick={() => {
                                setlogin("register");
                            }}
                        >
                            Chưa có tài khoản
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export const togglePasswordVisibility = (
    setPassword: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    setPassword((prev) => !prev); // Đổi trạng thái khi click
};

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export const Loading = () => {
    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin text-4xl text-white"
                />
            </div>
        </>
    );
};

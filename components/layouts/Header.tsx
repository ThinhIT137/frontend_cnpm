import { isAccessTokenValid } from "@/libs/hooks/isAccessTokenValid";

const Header = () => {

    
    return (
        <>
            <div className="flex justify-between pl-8 pr-8 pt-4 pb-4">
                <div>logo</div>
                <div></div>
                <div className="flex justify-between w-32">
                    <div>Notification</div>
                    {isAccessTokenValid() ? (
                        <>
                            <div>asdsd</div>
                        </>
                    ) : (
                        <>
                            <div>login</div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;

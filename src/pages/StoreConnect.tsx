import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

export function StoreConnect() {
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
            <SideMenu activeTab="store-connect" />

            <div className="flex-1 bg-white">
                <h1>Store Connect</h1>
            </div>
            </div>
        </>
    );
}

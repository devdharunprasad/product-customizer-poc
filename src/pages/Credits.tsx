import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

export function Credits() {
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
            <SideMenu activeTab="credits" />

            <div className="flex-1 bg-white">
                <h1>Store Credit</h1>
            </div>
            </div>
        </>
    );
}

import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

export function Resources() {
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
            <SideMenu activeTab="resources" />

            <div className="flex-1 bg-white">
                <h1>Resources</h1>
            </div>
            </div>
        </>
    );
}

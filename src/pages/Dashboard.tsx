import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

export function Dashboard() {
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
            <SideMenu activeTab="dashboard" />

            <div className="flex-1 bg-white">
                <h1>Dashboard</h1>
            </div>
            </div>
        </>
    );
}

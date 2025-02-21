import { useState } from "react";
import { Home, Settings, User, Package, Bell } from "lucide-react";

const Dashboard = () => {
  const [showOption, setShowOption] = useState(false);

  return (
    <div className="h-screen w-20 bg-gray-900 text-white flex flex-col items-center py-5 space-y-6 relative">
      <Home 
        className="w-6 h-6 cursor-pointer hover:text-gray-400" 
        onClick={() => setShowOption(!showOption)}
      />
      <Package className="w-6 h-6 cursor-pointer hover:text-gray-400" />
      <Bell className="w-6 h-6 cursor-pointer hover:text-gray-400" />
      <User className="w-6 h-6 cursor-pointer hover:text-gray-400" />
      <Settings className="w-6 h-6 cursor-pointer hover:text-gray-400" />
      
      {showOption && (
        <div className="absolute left-20 top-2 bg-white text-black p-80 rounded-lg shadow-lg">
          <p>Product Information</p>
          <p>White Solid T-shirt half sleeves</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

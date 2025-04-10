import { IoIosSettings } from "react-icons/io";
import { FaFileImport } from "react-icons/fa";
import { FaAudioDescription } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-4 space-y-4 h-screen overflow-y-auto sticky top-0">
      {/* System Settings Link */}
      <Link to="/settings" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
        <IoIosSettings className="w-5 h-5" />
        <span>System Settings</span>
      </Link>

      {/* Interfaces Link */}
      <Link to="/interfaces" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
        <FaFileImport className="w-5 h-5" />
        <span>Interfaces</span>
      </Link>


      <Link to="/IpAddress" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
        <FaAudioDescription className="w-5 h-5" />
        <span>IpAddresses</span>
      </Link>

      {/* Add more links or items here if necessary */}
    </div>
  );
};

export default Sidebar;

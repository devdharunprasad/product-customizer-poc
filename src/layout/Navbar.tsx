import logo from "../assets/logo.svg"
import { CartIcon, NotificationIcon, PersonIcon } from '@shopify/polaris-icons';

export function Navbar() {
    return (
        <div className="max-w-screen flex gap-10 justify-between p-3 pr-9 bg-navbar-dark-900 text-white">
            <div className="flex items-center flex-shrink-0">
                <a href="/">
                    <img src={logo} className="h-6" />
                </a>
            </div>
            <div className="flex gap-2">
                <button className="items-center justify-center w-10 h-10 rounded-full fill-white p-2.5 hover:bg-navbar-dark-700">
                    <CartIcon />
                </button>
                <button className="items-center justify-center w-10 h-10 rounded-full fill-white p-2.5 hover:bg-navbar-dark-700">
                    <NotificationIcon />
                </button>
                <button className="items-center justify-center w-10 h-10 rounded-full fill-white p-2.5 hover:bg-navbar-dark-700">
                    <PersonIcon />
                </button>
                <button className="text-center text-sm w-30 h-10 rounded-xl bg-navbar-dark-700 hover:border-1 border-gray-600">
                    New Order
                </button>
            </div>
        </div>
    )
}
import { Link } from 'react-router-dom';
import { ListBulletedIcon, PageAddIcon, ImagesIcon, WalletIcon, PaintBrushFlatIcon, LightbulbIcon, SettingsIcon, StoreIcon, OrderIcon, HomeIcon } from '@shopify/polaris-icons';
import React from 'react';

interface SideMenuProps {
    activeTab: 'dashboard' | 'catalog' | 'templates' | 'orders' | 'store-connect' | 'mockup' | 'credits' | 'branding' | 'resources' | 'settings';
}

const SidebarItem = ({ icon, label, isActive, to }: { icon: React.ReactNode, label: string, isActive: boolean, to: string }) => (
  <Link to={to}>
    <div className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors ${
      isActive ? 'bg-[#272727] text-white [&_svg]:text-white [&_svg]:fill-white' : 'text-[#202020] hover:bg-[#F4F4F5]'
    }`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  </Link>
);

export function SideMenu({ activeTab }: SideMenuProps) {
  return (
    <div className="w-[265px] bg-[#EBEBEB] p-3 flex flex-col gap-4">
          <nav className="flex flex-col gap-2">
            <SidebarItem
              to="/dashboard"
              icon={<HomeIcon className='w-5 h-5' />}
              isActive={activeTab === 'dashboard'}
              label="Dashboard"
            />
            <SidebarItem
              to="/catalog"
              icon={<ListBulletedIcon className='w-5 h-5' />}
              isActive={activeTab === 'catalog'}
              label="Product Catalog"
            />
            <SidebarItem
              to="/templates"
              icon={<PageAddIcon className='w-5 h-5' />}
              isActive={activeTab === 'templates'}
              label="Product Templates"
            />
            <SidebarItem
              to="/orders"
              icon={<OrderIcon className='w-5 h-5' />}
              isActive={activeTab === 'orders'}
              label="Orders"
            />
            <SidebarItem
              to="/store-connect"
              icon={<StoreIcon className='w-5 h-5' />}
              isActive={activeTab === 'store-connect'}
              label="Store Connect"
            />
            <SidebarItem
              to="/mockup"
              icon={<ImagesIcon className='w-5 h-5' />}
              isActive={activeTab === 'mockup'}
              label="Mockup Generator"
            />
            <SidebarItem
              to="/credits"
              icon={<WalletIcon className='w-5 h-5' />}
              isActive={activeTab === 'credits'}
              label="Store Credits"
            />
            <SidebarItem
              to="/branding"
              icon={<PaintBrushFlatIcon className='w-5 h-5' />}
              isActive={activeTab === 'branding'}
              label="Custom Branding"
            />
            <SidebarItem
              to="/resources"
              icon={<LightbulbIcon className='w-5 h-5' />}
              isActive={activeTab === 'resources'}
              label="Resources"
            />
            <SidebarItem
              to="/settings"
              icon={<SettingsIcon className='w-5 h-5' />}
              isActive={activeTab === 'settings'}
              label="Settings"
            />
          </nav>
        </div>
  );
}

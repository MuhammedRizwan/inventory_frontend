'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Home, ShoppingBag, Users, ShoppingCart, FileText, ChevronDown, PlusCircle, List } from 'lucide-react';

interface NavItemProps {
    href: string;
    icon?: React.ReactNode;
    text: string;
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
    const [isPurchaseOpen, setIsPurchaseOpen] = useState<boolean>(false);
    const [isMobileReportOpen, setIsMobileReportOpen] = useState<boolean>(false);
    const [isMobilePurchaseOpen, setIsMobilePurchaseOpen] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const purchaseDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsReportOpen(false);
            }
            if (purchaseDropdownRef.current && !purchaseDropdownRef.current.contains(event.target as Node)) {
                setIsPurchaseOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="font-bold text-xl">Admin Panel</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                        <NavItem href="/dashboard" icon={<Home size={20} />} text="Dashboard" />
                        <NavItem href="/product" icon={<ShoppingBag size={20} />} text="Products" />
                        <NavItem href="/customer" icon={<Users size={20} />} text="Customers" />

                        {/* Purchase Dropdown */}
                        <div className="relative" ref={purchaseDropdownRef}>
                            <button
                                onClick={() => setIsPurchaseOpen((prev) => !prev)}
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none"
                            >
                                <ShoppingCart size={20} className="mr-2" />
                                Purchases
                                <ChevronDown size={16} className={`ml-1 transform transition-transform ${isPurchaseOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>

                            {isPurchaseOpen && (
                                <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800">
                                    <a href="/purchase/add" className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
                                        <PlusCircle size={16} className="mr-2" />
                                        Add Purchase
                                    </a>
                                    <a href="/purchase" className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
                                        <List size={16} className="mr-2" />
                                        List Purchase
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Reports Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsReportOpen((prev) => !prev)}
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none"
                            >
                                <FileText size={20} className="mr-2" />
                                Reports
                                <ChevronDown size={16} className={`ml-1 transform transition-transform ${isReportOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>

                            {isReportOpen && (
                                <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800">
                                    <a href="/report/sales" className="block px-4 py-2 text-sm hover:bg-gray-100">Sales Report</a>
                                    <a href="/report/product" className="block px-4 py-2 text-sm hover:bg-gray-100">Product Report</a>
                                    <a href="/report/ledger" className="block px-4 py-2 text-sm hover:bg-gray-100">Customer Ledger</a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <MobileNavItem href="/dashboard" icon={<Home size={20} />} text="Dashboard" />
                    <MobileNavItem href="/products" icon={<ShoppingBag size={20} />} text="Products" />
                    <MobileNavItem href="/customers" icon={<Users size={20} />} text="Customers" />

                    {/* Mobile Purchase Dropdown */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setIsMobilePurchaseOpen(!isMobilePurchaseOpen)}
                            className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 focus:outline-none"
                        >
                            <ShoppingCart size={20} className="mr-2" />
                            Purchases
                            <ChevronDown size={16} className={`ml-1 transform transition-transform ${isMobilePurchaseOpen ? 'rotate-180' : 'rotate-0'}`} />
                        </button>

                        <div className={`pl-6 space-y-1 ${isMobilePurchaseOpen ? 'block' : 'hidden'}`}>
                            <a href="/purchase/add" className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                                Add Purchase
                            </a>
                            <a href="/purchase/list" className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                                List Purchase
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, text }) => (
    <a href={href} className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
        {icon && <span className="mr-2">{icon}</span>}
        {text}
    </a>
);

const MobileNavItem: React.FC<NavItemProps> = ({ href, icon, text }) => (
    <a href={href} className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">
        {icon && <span className="mr-2">{icon}</span>}
        {text}
    </a>
);

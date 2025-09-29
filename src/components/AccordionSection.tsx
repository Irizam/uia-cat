import { type FC, type ReactNode } from 'react';

interface AccordionProps {
    title: string;
    children: ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionSection: FC<AccordionProps> = ({ title, children, isOpen, onClick }) => {
    const headerClasses = isOpen
        ? "text-lg font-bold text-indigo-300 border-l-4 border-indigo-500 pl-3 transition-colors duration-300"
        : "text-lg font-semibold text-white transition-colors duration-300";
    const contentClasses = isOpen
        ? "max-h-screen opacity-100 mt-3 transition-all duration-500 ease-in-out"
        : "max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out";
    return (
        <div className="border border-gray-700 rounded-lg p-3 bg-gray-800/60 shadow-md">
            {/* Header (The Clickable Button) */}
            <button onClick={onClick} className="flex justify-between items-center w-full focus:outline-none hover:cursor-pointer">
                <h2 className={headerClasses}>
                    {title}
                </h2>
                {/* Chevron Icon for visual cue */}
                <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : 'rotate-0 text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {/* Content Body (Collapsible) */}
            <div className={contentClasses}>
                {children}
            </div>
        </div>
    );
};

export default AccordionSection;
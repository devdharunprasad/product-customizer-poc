import { InfoIcon } from '@shopify/polaris-icons';
import { colors } from '../../styles/theme';

interface TooltipProps {
    content: string;
}

export function Tooltip({ content }: TooltipProps) {
    return (
        <div className="group relative">
            <InfoIcon className="w-5 h-5 text-[#616161] fill-[#616161]" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-[#303030] text-white text-xs rounded-lg z-30">
                {content}
                <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#303030] rotate-45"></div>
            </div>
        </div>
    );
} 
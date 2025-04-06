interface FeatureCardProps {
    heading: string;
    description: string;
}

export function FeatureCard({ heading, description }: FeatureCardProps) {
    return (
        <div className="w-72 h-full border-1 bg-neutral-200 border-neutral-300 rounded-lg p-4 py-25 shadow-sm flex flex-col items-center space-y-6">
            <h2 className="text-xl p-0 font-semibold text-gray-800">{heading}</h2>
            <p className="text-gray-600 p-0 mt-0">{description}</p>
            <div className="flex flex-col items-center gap-3 w-full">
                <button 
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded border-neutral-200 hover:border-neutral-400 border-2 transition-colors"
                    onClick={() => console.log(`Start clicked for this feature`)}
                >
                    Start
                </button>
                <button 
                    className="w-full py-2 px-4 rounded border-neutral-200 hover:border-neutral-300 border-1"
                    onClick={() => console.log(`Learn More clicked for this feature`)}
                >
                    Learn More
                </button>
            </div>
        </div>
    );
};
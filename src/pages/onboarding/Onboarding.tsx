import { FeatureCard } from "./FeatureCard";

export function Onboarding() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full px-4 space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome to your Printrove Dashboard
                    </h1>
                </div>

                <div className="flex flex-wrap gap-8 justify-center" style={{ height: '50vh' }}>
                    <FeatureCard
                        heading="Create Your Free Account"
                        description="Started with ease by creating your free account. In a few clicks, access our features"
                    />
                    <FeatureCard
                        heading="Create your Products"
                        description="Upload your products quickly and easily. Start building your store in just a few steps"
                    />
                    <FeatureCard
                        heading="Set Up Billing"
                        description="Set up billing securely to manage payments. Set up billing securely to manage"
                    />
                    <FeatureCard
                        heading="Place your first order"
                        description="Make your brand stand out with unique branding. Stand out with unique branding"
                    />
                </div>

                <div className="text-center space-y-4 pt-30">
                    <h3>Don’t want to see the guide? <a href="/dashboard" className="text-blue-600"> Skip </a></h3>
                </div>
            </div>
        </div>
    );
}
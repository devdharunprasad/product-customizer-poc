export function ErrorPage() {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-4">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-xl font-bold text-gray-800">Error - Page Not Found</h1>
          <p className="text-gray-600">Go back to our home page: <a href="/" className="link-blue hover:text-blue-500">Home</a></p>
        </div>
      </div>
    );
  }
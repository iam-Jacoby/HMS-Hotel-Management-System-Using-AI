export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hotel Management System</h1>
        <p className="text-lg text-gray-600 mb-8">Welcome to Grandview Hotel</p>
        <div className="space-x-4">
          <a href="/login" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Login</a>
          <a href="/register" className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">Register</a>
        </div>
      </div>
    </div>
  );
}

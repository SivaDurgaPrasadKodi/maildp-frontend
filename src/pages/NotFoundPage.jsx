const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-gray-500 text-xl">Page Not Found</p>
        <a href="/login" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg">
          Go to Login
        </a>
      </div>
    </div>
  )
}

export default NotFoundPage
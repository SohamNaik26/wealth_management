export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-card overflow-hidden h-64"
          >
            <div className="p-5 h-full flex flex-col">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="mt-auto h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex justify-end space-x-2">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

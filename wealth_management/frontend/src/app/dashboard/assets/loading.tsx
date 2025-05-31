export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full bg-white rounded-lg shadow-card overflow-hidden">
          <div className="bg-gray-50 p-4">
            <div className="grid grid-cols-9 gap-4">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="grid grid-cols-9 gap-4">
                  {[...Array(9)].map((_, j) => (
                    <div
                      key={j}
                      className="h-6 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

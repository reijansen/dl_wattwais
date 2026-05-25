export default function DaisySkeletonGrid({ titleWidth = 'w-64', subtitleWidth = 'w-80' }) {
  return (
    <div className="card bg-base-200 shadow-lg border border-base-300">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-2">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className={`skeleton h-6 ${titleWidth}`} />
            <div className={`skeleton h-4 ${subtitleWidth}`} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card bg-base-100 border border-base-300">
              <div className="card-body p-5">
                <div className="flex items-center justify-between">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton w-8 h-8 rounded-lg" />
                </div>
                <div className="skeleton h-10 w-32 mt-4" />
                <div className="skeleton h-4 w-20 mt-2" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="skeleton h-4 w-40 mb-3" />
          <div className="skeleton h-3 w-full mb-2" />
          <div className="skeleton h-3 w-11/12 mb-2" />
          <div className="skeleton h-3 w-10/12" />
        </div>
      </div>
    </div>
  );
}


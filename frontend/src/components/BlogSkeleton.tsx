export const BlogSkeleton = () => {
  return (
    <div role="status" className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full max-w-2xl mx-auto mb-6 animate-pulse">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-slate-200 rounded-full w-24"></div>
          <div className="h-2 bg-slate-100 rounded-full w-16"></div>
        </div>
      </div>

      <div className="h-6 bg-slate-200 rounded-full w-3/4 mb-4"></div>
      
      <div className="space-y-3 mb-6">
        <div className="h-3 bg-slate-100 rounded-full w-full"></div>
        <div className="h-3 bg-slate-100 rounded-full w-full"></div>
        <div className="h-3 bg-slate-100 rounded-full w-2/3"></div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
        <div className="h-4 bg-slate-100 rounded-full w-20"></div>
        <div className="flex gap-4">
            <div className="h-4 bg-slate-100 rounded-full w-8"></div>
            <div className="h-4 bg-slate-100 rounded-full w-8"></div>
            <div className="h-4 bg-slate-100 rounded-full w-8"></div>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

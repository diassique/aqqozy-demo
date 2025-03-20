'use client';

export const Loader = () => {
  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center gap-4">
      <div className="relative w-20 h-20 animate-[pulse-scale_2s_ease-in-out_infinite]">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-full h-full border-4 border-[#E75825]/10 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#E75825] rounded-full animate-[spin_0.8s_cubic-bezier(0.5,0.1,0.5,0.9)_infinite] border-t-transparent border-l-transparent" />
          <div className="absolute top-2 left-2 right-2 bottom-2 border-4 border-[#E75825]/70 rounded-full animate-[spin_1.2s_cubic-bezier(0.5,0.1,0.5,0.9)_infinite_reverse] border-b-transparent border-r-transparent" />
          <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-[#E75825]/40 rounded-full animate-[spin_1.5s_linear_infinite]" />
        </div>
      </div>
      <div className="text-gray-500 font-medium animate-pulse">Загрузка...</div>
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="relative w-24 h-24 animate-[pulse-scale_2s_ease-in-out_infinite]">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-full h-full border-4 border-[#E75825]/10 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#E75825] rounded-full animate-[spin_0.8s_cubic-bezier(0.5,0.1,0.5,0.9)_infinite] border-t-transparent border-l-transparent" />
          <div className="absolute top-2 left-2 right-2 bottom-2 border-4 border-[#E75825]/70 rounded-full animate-[spin_1.2s_cubic-bezier(0.5,0.1,0.5,0.9)_infinite_reverse] border-b-transparent border-r-transparent" />
          <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-[#E75825]/40 rounded-full animate-[spin_1.5s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#E75825] rounded-full animate-pulse" />
        </div>
      </div>
      <div className="text-gray-500 font-medium animate-pulse">Загрузка...</div>
    </div>
  );
}; 
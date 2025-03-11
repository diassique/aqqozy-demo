'use client';

export const Loader = () => {
  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center gap-4">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-full h-full border-4 border-[#E75825]/20 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#E75825] rounded-full animate-[loader-spin_1s_linear_infinite] border-t-transparent" />
        </div>
      </div>
      <div className="text-gray-500 font-medium">Загрузка...</div>
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-full h-full border-4 border-[#E75825]/20 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#E75825] rounded-full animate-[loader-spin_1s_linear_infinite] border-t-transparent" />
        </div>
      </div>
      <div className="text-gray-500 font-medium">Загрузка...</div>
    </div>
  );
}; 
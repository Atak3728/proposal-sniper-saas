import Link from 'next/link';

const Sidebar = () => {
  return (
    <nav className="w-20 bg-[#0b0d12] border-r border-glass-border flex flex-col items-center py-6 gap-6 z-30 flex-shrink-0">
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] mb-2">
        <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
      </div>
      <div className="flex flex-col gap-3 w-full px-3">
        <Link href="/dashboard" className="w-full aspect-square rounded-xl bg-primary/10 border border-primary/20 text-primary flex flex-col gap-1 items-center justify-center transition-all group relative hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]">
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="#" className="w-full aspect-square rounded-xl text-gray-500 hover:text-gray-200 hover:bg-white/5 flex flex-col gap-1 items-center justify-center transition-all group relative">
          <span className="material-symbols-outlined text-[24px]">history</span>
          <span className="text-[10px] font-medium">History</span>
        </Link>
        <Link href="#" className="w-full aspect-square rounded-xl text-gray-500 hover:text-gray-200 hover:bg-white/5 flex flex-col gap-1 items-center justify-center transition-all group relative">
          <span className="material-symbols-outlined text-[24px]">extension</span>
          <span className="text-[10px] font-medium">Templates</span>
        </Link>
      </div>
      <div className="mt-auto flex flex-col gap-3 w-full px-3">
        <Link href="/settings" className="w-full aspect-square rounded-xl text-gray-500 hover:text-gray-200 hover:bg-white/5 flex flex-col gap-1 items-center justify-center transition-all group relative">
          <span className="material-symbols-outlined text-[24px]">settings</span>
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;

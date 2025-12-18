import Sidebar from '@/app/components/Sidebar';

const SettingsPage = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <header className="h-16 border-b border-border-dark flex items-center justify-between px-6 md:px-10 bg-background-dark/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-2 text-sm text-[#ab9cba]">
            <span>Settings</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-white font-medium">General & Profile</span>
          </div>
          <button className="md:hidden text-white p-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex flex-col gap-2 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Account Settings</h1>
              <p className="text-[#ab9cba] text-base font-light max-w-2xl">Manage your personal details and subscription preferences.</p>
            </div>
            <section className="glass-panel rounded-xl p-5 md:p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex flex-col items-center gap-3 min-w-[100px]">
                  <div className="relative group cursor-pointer">
                    <div
                      className="size-20 rounded-full bg-cover bg-center border border-border-dark group-hover:border-primary transition-colors"
                      style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0XtAqNbgUa8HOOZzij_cq4qrO4WTGRheNZFknpiEbtfGh93RmvaRLtw0B6thZbH5sP280xCIFTQDdHhc9wsQ3p7hu4v1f2zW2qLY5A-BxlrKOxMOB1bOhuL2fTDTAVNBwxkN1JWldQRtdOFRTumbreukbFJBuDeOIKZt6OzjgGkMgBtDo3KXvLkGaCv6ZqSI1ESiHcdzhm8Eoye20Tg5PB9xFMHtJUlgCoNTgbedOa8CyfZ6xuhYJikXWGYBDp-NyFuAnhhcOLR2l")` }}
                    ></div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-primary hover:text-primary-hover uppercase tracking-wider">Edit Photo</button>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                      Profile Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-[#ab9cba]">Full Name</span>
                      <input className="bg-[#141118] border border-border-dark text-white rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-600" type="text" defaultValue="Alex Morgan" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-[#ab9cba]">Email Address</span>
                      <input className="bg-[#141118] border border-border-dark text-white rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-600" type="email" defaultValue="alex@sniper.io" />
                    </label>
                    <label className="flex flex-col gap-1.5 md:col-span-2">
                      <span className="text-xs font-medium text-[#ab9cba]">Job Title</span>
                      <input className="bg-[#141118] border border-border-dark text-white rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-600" type="text" defaultValue="Senior Freelance Developer" />
                    </label>
                  </div>
                </div>
              </div>
            </section>
            <section className="glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">rocket_launch</span>
                    Subscription Plan
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Sniper Pro</span>
                    <span className="text-[#ab9cba] text-sm">Billed Monthly</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                  <button className="px-4 py-2 bg-transparent border border-border-dark text-white rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">Billing History</button>
                  <button className="px-4 py-2 bg-white text-black border border-white rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">Manage Plan</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <div className="bg-[#141118] border border-border-dark rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[#ab9cba] text-xs font-medium uppercase tracking-wider">Proposals Generated</p>
                    <span className="material-symbols-outlined text-primary/50 text-[20px]">edit_document</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">45</span>
                    <span className="text-sm text-[#ab9cba] mb-1">/ 50 limit</span>
                  </div>
                  <div className="w-full bg-[#302839] h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div className="bg-[#141118] border border-border-dark rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[#ab9cba] text-xs font-medium uppercase tracking-wider">Templates</p>
                    <span className="material-symbols-outlined text-primary/50 text-[20px]">layers</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">12</span>
                    <span className="text-sm text-[#ab9cba] mb-1">active</span>
                  </div>
                  <div className="w-full bg-[#302839] h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className="bg-[#141118] border border-border-dark rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[#ab9cba] text-xs font-medium uppercase tracking-wider">Next Billing</p>
                    <span className="material-symbols-outlined text-primary/50 text-[20px]">calendar_month</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">Oct 24</span>
                    <span className="text-sm text-[#ab9cba] mb-1">2023</span>
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-xs text-green-400">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    Auto-renew active
                  </div>
                </div>
              </div>
            </section>
            <section className="glass-panel rounded-xl p-5 md:p-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-[20px]">logout</span>
                  Sign Out
                </h2>
                <p className="text-[#ab9cba] text-xs mt-1">End your current session safely.</p>
              </div>
              <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                Logout
              </button>
            </section>
          </div>
        </div>
        <div className="border-t border-border-dark bg-[#141118] p-4 md:px-10 flex items-center justify-end gap-4 z-20">
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium text-[#ab9cba] hover:text-white transition-colors">Discard</button>
          <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;

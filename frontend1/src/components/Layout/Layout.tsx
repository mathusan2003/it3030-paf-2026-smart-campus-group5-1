import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#F3F4F6]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#F3F4F6]">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
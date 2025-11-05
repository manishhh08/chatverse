import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      <header className="bg-light p-3 text-center">
        <h3>Welcome to ChatVerse</h3>
      </header>

      {/* Page content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;

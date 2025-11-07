import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

const PublicLayout = () => {
  return (
    <div>
      {/* Page content */}
      <main className="bg-dark text-white d-flex flex-column vh-100">
        {/* Welcome Header */}
        <header className="py-4 border-bottom border-secondary">
          <Container>
            <h1 className="text-center">Welcome to Chatverse!</h1>
            <p className="text-center text-white-50">
              Please login or register to continue
            </p>
          </Container>
        </header>

        {/* Render child routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;

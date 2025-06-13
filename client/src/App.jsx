import { AuthProvider } from "./context/AuthContext";
import AuthenticatedApp from "./components/AuthenticatedApp";

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;


import { AppProvider } from "@/context/AppContext";
import Dashboard from "./Dashboard";

const Index = () => {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
};

export default Index;

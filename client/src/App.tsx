import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./Router";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="w-full h-full flex flex-col items-center text-gray-900">
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </div>
  );
}

export default App;

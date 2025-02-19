import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";

function App() {
  return (
    <div className="min-h-screen p-4 bg-gray-200">
      <h1 className="text-2xl font-bold text-center mb-4">Application & Approval System</h1>
      <ApplicationForm />
      <ApplicationList />
    </div>
  );
}

export default App;

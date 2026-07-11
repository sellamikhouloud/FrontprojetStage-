import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex">
      <Sidebar role="coordinator" />

      <main className="flex-1">
        {/* Ton contenu */}
      </main>
    </div>
  );
}

export default App;
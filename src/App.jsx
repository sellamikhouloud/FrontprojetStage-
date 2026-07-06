import PhotoRefuse from "./components/PhotoRefusee";

function App() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <PhotoRefuse
        onClose={() => console.log("Close")}
      />
    </div>
  );
}

export default App;
import { Homepage } from "./pages/Homepage";
import { useWind } from "./hooks/use-wind";

function App() {
    const windData = useWind();

    return <Homepage windData={windData} />;
}

export default App;

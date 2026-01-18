import "./App.css";
import { routes } from "./utils/Routes";
import { useRoutes } from "react-router-dom";
import DynamicFieldRowsDemo from "./components/DynamicFieldRowsDemo";

function App() {
  const element = useRoutes(routes);
  return element;
  // return <DynamicFieldRowsDemo />;
}

export default App;

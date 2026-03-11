import "./App.css";
import { routes } from "./utils/Routes";
import { useRoutes } from "react-router-dom";
import Timetable from "./pages/Timetable";

function App() {
  const element = useRoutes(routes);
  return element;
  // return <DynamicFieldRowsDemo />;
  // return <Timetable />;
}

export default App;

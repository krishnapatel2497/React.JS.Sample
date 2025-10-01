import { UserProvider } from "./context/UserContext";
import Users from "./Users";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      <UserProvider>
        <Users/>
        <Toaster position="top-center" reverseOrder={false}/>
      </UserProvider>
    </>
  );
}

export default App;

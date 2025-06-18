import { useContext } from "react";
import { AuthContext } from "../Auth.jsx";

const useAuth = () => useContext(AuthContext);
export default useAuth;
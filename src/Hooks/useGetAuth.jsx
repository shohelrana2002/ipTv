import { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";

const useGetAuth = () => useContext(AuthContext);

export default useGetAuth;

import { ReactNode, createContext, useState } from "react";

type Props = {
    children?: ReactNode
}

const AuthContext = createContext({})

export const AuthProvider = ({ children }: Props) => {
    const [auth, setAuth] = useState({})
    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
import React from "react";

export type AuthContext = {
  login: (username: string) => void;
  logout: () => void;
} & AuthContextState;

type AuthContextState = {
  status: "loggedOut" | "loggedIn";
  username?: string;
};

export function AuthProvider(props: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthContextState>({
    status: "loggedOut",
  });

  const login = (username: string) => {
    setState({ status: "loggedIn", username });
  };

  const logout = () => {
    setState({ status: "loggedOut" });
  };

  const contextValue = React.useMemo(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={contextValue} children={props.children} />
  );
}

const AuthContext = React.createContext<AuthContext>(null!);
export default AuthContext

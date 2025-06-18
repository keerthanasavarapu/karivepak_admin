import React, { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";
import * as Storage from "../store/LocalStorage";

const initialState = {
    authenticated: false,
    user: null,
};

const reducers = {
    UPDATE: (state, action) => {
        const user = action.payload;
        return { ...state, user, authenticated: true };
    },
    LOGOUT: (state) => ({
        ...state,
        authenticated: false,
        user: null,
    }),
};

const reducer = (state, action) =>
    reducers[action.type] ? reducers[action.type](state, action) : state;

const AuthContext = createContext({
    ...initialState,
    logout: () => Promise.resolve(),
    updateUserContext: () => Promise.resolve(),
});

AuthProvider.propTypes = {
    children: PropTypes.node,
};

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const logout = () => {
        dispatch({ type: "LOGOUT" });
        Storage.remove(Storage.localStorageKey);
    };
    const updateUserContext = (data) => {
        dispatch({ type: "UPDATE", payload: data });
    };
    
    return (
        <AuthContext.Provider
            value={{
                ...state,
                logout,
                updateUserContext,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuthContext() {
    return useContext(AuthContext);
}

export { AuthContext, AuthProvider, useAuthContext};

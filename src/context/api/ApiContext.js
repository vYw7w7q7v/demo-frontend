import React, { createContext, useContext } from 'react';
import config from '../../configs/config';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    return (
        <ApiContext.Provider value={{ apiUrl: config.apiUrl }}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApiContext = () => useContext(ApiContext);

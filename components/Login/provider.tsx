import React, { createContext, ReactNode, SetStateAction, useContext, useState } from "react";
import _ from "lodash";

interface JellyfinAuthenticationContext {
    username: string | undefined;
    setUsername: React.Dispatch<SetStateAction<string | undefined>>;
    serverAddress: string | undefined;
    setServerAddress: React.Dispatch<SetStateAction<string | undefined>>;
    libraryName: string | undefined;
    setLibraryName: React.Dispatch<React.SetStateAction<string | undefined>>;
    libraryId: string | undefined;
    setLibraryId: React.Dispatch<React.SetStateAction<string | undefined>>;
    triggerAuth: boolean;
    setTriggerAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const JellyfinAuthenticationContextInitializer = () => {
    const [username, setUsername] = useState<string | undefined>(undefined);

    const [useHttp, setUseHttp] = useState<boolean>(false);
    const [useHttps, setUseHttps] = useState<boolean>(true);
    const [serverAddress, setServerAddress] = useState<string | undefined>(undefined);

    const [libraryName, setLibraryName] = useState<string | undefined>(undefined);
    const [libraryId, setLibraryId] = useState<string | undefined>(undefined);

    const [triggerAuth, setTriggerAuth] = useState<boolean>(true);

    return {
        username,
        setUsername,
        useHttp,
        setUseHttp,
        useHttps,
        setUseHttps,
        serverAddress,
        setServerAddress,
        libraryName,
        setLibraryName,
        libraryId,
        setLibraryId,
        triggerAuth,
        setTriggerAuth,
    };
}

const JellyfinAuthenticationContext = 
    createContext<JellyfinAuthenticationContext>({
        username: undefined,
        setUsername: () => {},
        serverAddress: undefined,
        setServerAddress: () => {},
        libraryName: undefined,
        setLibraryName: () => {},
        libraryId: undefined, 
        setLibraryId: () => {},
        triggerAuth: true,
        setTriggerAuth: () => {},
});

export const JellyfinAuthenticationProvider: ({ children }: {
    children: ReactNode;
}) => React.JSX.Element = ({ children }: { children: ReactNode }) => {

    const {
        username,
        setUsername,
        serverAddress,
        setServerAddress,
        libraryName,
        setLibraryName,
        libraryId,
        setLibraryId,
        triggerAuth,
        setTriggerAuth,
    } = JellyfinAuthenticationContextInitializer();

    return (
        <JellyfinAuthenticationContext.Provider value={{
            username,
            setUsername,
            serverAddress,
            setServerAddress,
            libraryName,
            setLibraryName,
            libraryId,
            setLibraryId,
            triggerAuth,
            setTriggerAuth,
        }}>
            { children }
        </JellyfinAuthenticationContext.Provider>
    );
};

export const useAuthenticationContext = () => useContext(JellyfinAuthenticationContext)
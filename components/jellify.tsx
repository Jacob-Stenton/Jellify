import _ from "lodash";
import { JellyfinApiClientProvider, useApiClientContext } from "./jellyfin-api-provider";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./navigation";
import Login from "./Login/component";
import { JellyfinAuthenticationProvider } from "./Login/provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { JellifyDarkTheme } from "./theme";
import { PlayerProvider } from "../player/provider";

export default function Jellify(): React.JSX.Element {

  return (
    <JellyfinApiClientProvider>
      <App />
    </JellyfinApiClientProvider>
  );
}

function App(): React.JSX.Element {

  // If library hasn't been set, we haven't completed the auth flow
  const { server, library } = useApiClientContext();
  
  return (
    <NavigationContainer theme={JellifyDarkTheme}>
      <SafeAreaProvider>
        { server && library ? (
          <PlayerProvider>
            <Navigation />
          </PlayerProvider>
         ) : (
          <JellyfinAuthenticationProvider>
            <Login /> 
          </JellyfinAuthenticationProvider>
        )}
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
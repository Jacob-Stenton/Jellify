import _ from "lodash"
import ServerAuthentication from "./helpers/server-authentication";
import ServerAddress from "./helpers/server-address";
import { createStackNavigator } from "@react-navigation/stack";
import ServerLibrary from "./helpers/server-library";
import { useAuthenticationContext } from "./provider";
import { useEffect } from "react";
import { useApiClientContext } from "../jellyfin-api-provider";

export default function Login(): React.JSX.Element {

    const { serverAddress, storedServer, changeServer, username, changeUsername, triggerAuth, setTriggerAuth } = useAuthenticationContext();

    const { apiClient } = useApiClientContext();

    const Stack = createStackNavigator();

    useEffect(() => {
        setTriggerAuth(false);
    })

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {
                (changeServer) ? (
                    <Stack.Screen
                        name="ServerAddress"
                        options={{
                            headerShown: false,     
                            animationTypeForReplace: triggerAuth || changeServer ? 'push' : 'pop'    
                        }}
                        component={ServerAddress}
                        />
                    ) : (
                    
                    (_.isUndefined(username) || changeUsername) ? (
                        <Stack.Screen 
                            name="ServerAuthentication" 
                            options={{ 
                                headerShown: false, 
                                animationTypeForReplace: changeUsername ? 'pop' : 'push'
                            }} 
                            component={ServerAuthentication} 
                        />
                    ) : (
                        <Stack.Screen 
                            name="LibrarySelection" 
                            options={{ 
                                headerShown: false 
                            }} 
                            component={ServerLibrary}
                        />
                    )
                )
            }
        </Stack.Navigator>
    );
}
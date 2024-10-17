import _ from "lodash"
import ServerAuthentication from "./helpers/server-authentication";
import ServerAddress from "./helpers/server-address";
import { createStackNavigator } from "@react-navigation/stack";
import { useApiClientContext } from "../jellyfin-api-provider";

export default function Login(): React.JSX.Element {

    const { server } = useApiClientContext();

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator>
            { 
                (_.isUndefined(server) || _.isEmpty(server.url)) ? (
                    <Stack.Screen
                        name="ServerAddress"
                        options={{title: "ServerAddress"}}
                        component={ServerAddress}
                        >
                        </Stack.Screen>
                    ) : (
                    <Stack.Screen
                        name="ServerAuthentication"
                        component={ServerAuthentication}
                        options={{
                            title: "Server Authentication",
                            animationTypeForReplace: 'pop'
                        }}
                    />
                )
            }
        </Stack.Navigator>
    );
}
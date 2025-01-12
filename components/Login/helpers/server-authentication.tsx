import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useApiClientContext } from "../../jellyfin-api-provider";
import _ from "lodash";
import { JellyfinCredentials } from "../../../api/types/jellyfin-credentials";
import { Spinner, View, YStack, ZStack } from "tamagui";
import { useAuthenticationContext } from "../provider";
import { H1 } from "../../Global/helpers/text";
import Button from "../../Global/helpers/button";
import Input from "../../Global/helpers/input";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServerAuthentication(): React.JSX.Element {
    const { username, setUsername } = useAuthenticationContext();
    const [password, setPassword] = React.useState<string | undefined>('');

    const { server, setServer, setUser, apiClient } = useApiClientContext();

    const useApiMutation = useMutation({
        mutationFn: async (credentials: JellyfinCredentials) => {
            return await apiClient!.authenticateUserByName(credentials.username, credentials.password!);
        },
        onSuccess: async (authResult) => {
              
            console.log(`Received auth response from server`)
            if (_.isUndefined(authResult))
                return Promise.reject(new Error("Authentication result was empty"))

            if (authResult.status >= 400 || _.isEmpty(authResult.data.AccessToken))
                return Promise.reject(new Error("Invalid credentials"))

            if (_.isUndefined(authResult.data.User))
                return Promise.reject(new Error("Unable to login"));

            console.log(`Successfully signed in to server`)
            return setUser({ 
                id: authResult.data.User!.Id!, 
                name: authResult.data.User!.Name!, 
                accessToken: (authResult.data.AccessToken as string) 
            })
        },
        onError: async (error: Error) => {
            console.error("An error occurred connecting to the Jellyfin instance", error);
            return Promise.reject(`An error occured signing into ${server!.name}`);
        }
    });

    return (
        <SafeAreaView>
            <H1>
                { `Sign in to ${server?.name ?? "Jellyfin"}`}
            </H1>
            <Button
                onPress={() => {
                    setServer(undefined);
                }}>
                    Switch Server
            </Button>

            <YStack>
                <Input
                    placeholder="Username"
                    value={username}
                    onChangeText={(value) => setUsername(value)}
                    />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={(value) => setPassword(value)}
                    secureTextEntry
                    />
            </YStack>

            <ZStack>
                { useApiMutation.isPending && (
                    <Spinner />
                )}

                <Button 
                    disabled={_.isEmpty(username) || _.isEmpty(password) || useApiMutation.isPending}
                    onPress={() => {
                        
                        if (!_.isUndefined(username)) {
                            console.log(`Signing in to ${server!.name}`);
                            useApiMutation.mutate({ username, password });
                        }
                    }}
                    >
                        Sign in
                </Button>
            </ZStack>
        </SafeAreaView>
    );
}
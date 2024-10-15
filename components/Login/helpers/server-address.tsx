import React, { useState } from "react";
import _ from "lodash";
import { Jellyfin } from "@jellyfin/sdk";
import { getSystemApi } from "@jellyfin/sdk/lib/utils/api/system-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../api/queries";
import { AsyncStorageKeys } from "../../../enums/async-storage-keys";
import { Button, TextField, View } from "react-native-ui-lib";
import { JellifyServer } from "../../../types/JellifyServer";

export default function ServerAddress(): React.JSX.Element {

    const [serverUrl, setServerUrl] = useState("");

    const [storeUrl, setStoreUrl] = useState("");

    const serverUrlMutation = useMutation({
        mutationFn: async (serverUrl: string) => {
    
            console.log("Mutating server URL");
    
            if (!!!serverUrl)
                throw Error("Server URL is empty")
    
            let jellyfin = new Jellyfin(client);
            let api = jellyfin.createApi(serverUrl);

            console.log(`Created API client for ${api.basePath}`)
            return await getSystemApi(api).getPublicSystemInfo()
        },
        onSuccess: (publicSystemInfoResponse, serverUrl, context) => {
            if (!!!publicSystemInfoResponse.data.Version)
                throw new Error("Jellyfin instance did not respond");
    
            console.debug("REMOVE THIS::onSuccess variable", serverUrl);
            console.log(`Connected to Jellyfin ${publicSystemInfoResponse.data.Version!}`);

            // TODO: Store these along side address
            // TODO: Rename url to address
            
            let jellifyServer: JellifyServer = {
                url: serverUrl,
                name: publicSystemInfoResponse.data.ServerName!,
                version: publicSystemInfoResponse.data.Version!,
                startUpComplete: publicSystemInfoResponse.data.StartupWizardCompleted!
            }
            return AsyncStorage.setItem(AsyncStorageKeys.ServerUrl, JSON.stringify(jellifyServer));
        },
        onError: (error: Error) => {
            console.error("An error occurred connecting to the Jellyfin instance", error);
        }
    });

    return (
        <View useSafeArea>
            <TextField 
                placeholder="Jellyfin Server Address"
                onChangeText={setServerUrl}>
            </TextField>

            <Button 
                onPress={() => serverUrlMutation.mutate(serverUrl)}
                label="Connect"
            />
        </View>
    )
}
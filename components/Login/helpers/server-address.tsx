import React, { useState } from "react";
import { validateServerUrl } from "../utils/validation";
import _ from "lodash";
import { Button, Input, YStack } from "tamagui";
import { Jellyfin } from "@jellyfin/sdk";
import { getSystemApi } from "@jellyfin/sdk/lib/utils/api/system-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../api/queries";
import { AsyncStorageKeys } from "../../../enums/async-storage-keys";

export default function ServerAddress(): React.JSX.Element {

    const [serverUrl, setServerUrl] = useState("");

    const serverUrlMutation = useMutation({
        mutationFn: async (serverUrl: string | undefined) => {
    
            console.log("Mutating server URL");
    
            if (!!!serverUrl)
                throw Error("Server URL was empty")
    
            let jellyfin = new Jellyfin(client);
            let api = jellyfin.createApi(serverUrl);
            return await getSystemApi(api).getPublicSystemInfo()
        },
        onSuccess: (publicSystemInfoResponse, serverUrl, context) => {
            if (!!!publicSystemInfoResponse.data.Version)
                throw new Error("Unable to connect to Jellyfin Server");
    
            console.log(`Connected to Jellyfin ${publicSystemInfoResponse.data.Version!}`);
            return AsyncStorage.setItem(AsyncStorageKeys.ServerUrl, serverUrl!);
        }
    });

    return (
        <YStack>
                <Input placeholder="Jellyfin Server Address"
                    onChangeText={(value) => validateServerUrl(value) ? setServerUrl(value) : console.log("Invalid Address")}
                    ></Input>

                <Button 
                    onPress={() => serverUrlMutation.mutate(serverUrl)}
                    disabled={_.isEmpty(serverUrl) || serverUrlMutation.isPending}>
                        Connect
                </Button>
        </YStack>
    )
}
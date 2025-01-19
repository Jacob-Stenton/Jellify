import React, { useState } from "react";
import _ from "lodash";
import { useMutation } from "@tanstack/react-query";
import { MMKVStorageKeys } from "../../../enums/mmkv-storage-keys";
import { JellifyServer } from "../../../types/JellifyServer";
import { useApiClientContext } from "../../jellyfin-api-provider";
import { Spacer, Spinner, View, XStack, ZStack } from "tamagui";
import { SwitchWithLabel } from "../../Global/helpers/switch-with-label";
import { H1 } from "../../Global/helpers/text";
import Input from "../../Global/helpers/input";
import Button from "../../Global/helpers/button";
import { http, https } from "../utils/constants";
import { storage } from "../../../constants/storage";
import { JellyfinInfo } from "../../../api/info";
import { Jellyfin } from "@jellyfin/sdk/lib/jellyfin";
import { getSystemApi } from "@jellyfin/sdk/lib/utils/api/system-api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServerAddress(): React.JSX.Element {

    const { setServer } = useApiClientContext();

    const [useHttps, setUseHttps] = useState<boolean>(true);
    const [serverAddress, setServerAddress] = useState<string | undefined>(undefined);

    const useServerMutation = useMutation({
        mutationFn: async () => {
            let jellyfin = new JellyfinInfo(JellyfinInfo);

            if (!!!serverAddress) 
                throw new Error("Server address was empty");

            let api  = jellyfin.createApi(`${useHttps ? https : http}${serverAddress}`);

            return getSystemApi(api).getPublicSystemInfo();
        },
        onSuccess: async (publicSystemInfoResponse) => {
            if (!!!publicSystemInfoResponse.data.Version)
                throw new Error("Jellyfin instance did not respond");
    
            console.debug("REMOVE THIS::onSuccess variable", publicSystemInfoResponse.data);
            console.log(`Connected to Jellyfin ${publicSystemInfoResponse.data.Version!}`);
    
            let jellifyServer: JellifyServer = {
                url: `${useHttps ? https : http}${serverAddress!}`,
                address: serverAddress!,
                name: publicSystemInfoResponse.data.ServerName!,
                version: publicSystemInfoResponse.data.Version!,
                startUpComplete: publicSystemInfoResponse.data.StartupWizardCompleted!
            }

            setServer(jellifyServer);
        },
        onError: async (error: Error) => {
            console.error("An error occurred connecting to the Jellyfin instance", error);
            return storage.set(MMKVStorageKeys.Server, "");
        }
    });

    return (
        <SafeAreaView>
            <H1>
                Connect to Jellyfin
            </H1>
            <XStack>
                <SwitchWithLabel 
                    checked={useHttps} 
                    onCheckedChange={(checked) => setUseHttps(checked)} 
                    label="Use HTTPS" 
                    size="$2"
                    width={100}
                 />
                    
                
                <Spacer />

                <Input 
                    value={serverAddress}
                    placeholder="jellyfin.org"
                    onChangeText={setServerAddress}
                    flexGrow
                />
            </XStack>

            <ZStack>
            { useServerMutation.isPending && (
                    <Spinner />
            )}

                <Button 
                    disabled={_.isEmpty(serverAddress)}
                    onPress={() => {
                        useServerMutation.mutate();
                    }}>
                    Connect
                </Button>
            </ZStack>
        </SafeAreaView>
    )
}
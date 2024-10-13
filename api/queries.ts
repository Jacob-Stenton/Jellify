import { Jellyfin } from "@jellyfin/sdk"
import { useQuery } from "@tanstack/react-query";
import { getDeviceNameSync, getUniqueIdSync } from "react-native-device-info"
import { QueryKeys } from "../enums/query-keys";
import { useCredentials } from "./queries/keychain";
import { name, version } from "../package.json"
import { createPublicApi } from "./query-functions/api";

export const client : Jellyfin  = new Jellyfin({
    clientInfo: {
        name: name,
        version: version
    },
    deviceInfo: {
        name: getDeviceNameSync(),
        id: getUniqueIdSync()
    }
});

export const usePublicApi = (serverUrl: string) => useQuery({
    queryKey: [QueryKeys.PublicApi, serverUrl],
    queryFn: ({ queryKey }) => {
        createPublicApi(queryKey[1])
    }
})

export const useApi = useQuery({
    queryKey: [QueryKeys.Api],
    queryFn: () => {
        let credentials = useCredentials.data!
        return client.createApi(credentials.server, credentials.password);
    }
})
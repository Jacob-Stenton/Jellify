import { useMutation } from "@tanstack/react-query";
import { usePublicApi } from "../queries";
import { useServerUrl } from "../queries/storage";
import { JellyfinCredentials } from "../types/jellyfin-credentials";
import { MutationKeys } from "../../enums/mutation-keys";
import { createPublicApi } from "../query-functions/api";
import { fetchServerUrl } from "../query-functions/storage";

export const authenticateWithCredentials = useMutation({
    mutationKey: [MutationKeys.AuthenticationWithCredentials],
    mutationFn: async (credentials: JellyfinCredentials) => {
        createPublicApi(await fetchServerUrl())
        .authenticateUserByName(credentials.username, credentials.password!);
    },
})
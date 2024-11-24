import { Api } from "@jellyfin/sdk";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../enums/query-keys";
import { fetchRecentlyPlayed } from "./functions/recents";

export const useRecentlyPlayed = (api: Api) => useQuery({
    queryKey: [QueryKeys.RecentlyPlayed, api],
    queryFn: ({ queryKey }) => fetchRecentlyPlayed(queryKey[1] as Api)
})
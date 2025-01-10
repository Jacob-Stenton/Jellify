import { Api } from "@jellyfin/sdk";
import { BaseItemDto, ItemSortBy, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";

export function fetchUserPlaylists(api: Api, userId: string, playlistLibraryId: string): Promise<BaseItemDto[]> {
    console.debug("Fetching user playlists");

    return new Promise(async (resolve, reject) => {
        getItemsApi(api)
            .getItems({
                userId: userId,
                parentId: playlistLibraryId,
                fields: [
                    "Path"
                ],
                sortBy: [
                    ItemSortBy.IsFolder,
                    ItemSortBy.SortName
                ],
                sortOrder: [
                    SortOrder.Ascending
                ]
            })
            .then((response) => {
                if (response.data.Items) {
                    console.log(response.data.Items);
                    resolve(response.data.Items.filter(playlist => playlist.Path?.includes("/config/data/playlists")))
                }
                else 
                    resolve([]);
            })
            .catch((error) => {
                console.error(error);
                reject(error)
            })
    })
}

export function fetchPublicPlaylists(api: Api, playlistLibraryId: string): Promise<BaseItemDto[]> {
    console.debug("Fetching public playlists");

    return new Promise(async (resolve, reject) => {
        getItemsApi(api)
            .getItems({
                parentId: playlistLibraryId,
                sortBy: [
                    ItemSortBy.IsFolder,
                    ItemSortBy.SortName
                ],
                sortOrder: [
                    SortOrder.Ascending
                ]
            })
            .then((response) => {
                if (response.data.Items)
                    resolve(response.data.Items.filter(playlist => !playlist.Path?.includes("/config/data/playlists")))
                else 
                    resolve([]);
            })
            .catch((error) => {
                console.error(error);
                reject(error)
            })
    })
}
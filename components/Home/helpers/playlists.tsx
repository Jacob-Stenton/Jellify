import { useUserPlaylists } from "@/api/queries/playlist";
import { Card } from "@/components/Global/card";
import { H2 } from "@/components/Global/text";
import { useApiClientContext } from "@/components/jellyfin-api-provider";
import React from "react";
import { FlatList } from "react-native";
import { ScrollView, View } from "tamagui";

export default function Playlists() : React.JSX.Element {

    const { apiClient, user, library } = useApiClientContext();

    const { data: playlists } = useUserPlaylists(apiClient!, user!.id, library!.playlistLibraryId);

    return (
        <View>
            <H2>Your Playlists</H2>
            <FlatList horizontal
                data={playlists}
                renderItem={({ item: playlist }) => {
                    return (
                        <Card
                            itemId={playlist.Id!}
                            caption={playlist.Name ?? "Untitled Playlist"}
                            onPress={() => {

                            }} />
                    )
                }} />
        </View>
    )
}
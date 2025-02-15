import { RouteProp } from "@react-navigation/native";
import { TracksProps, StackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import Track from "../Global/components/track";
import { FlatList, RefreshControl } from "react-native";
import { QueryKeys } from "../../enums/query-keys";
import { fetchRecentlyPlayed } from "../../api/queries/functions/recents";
import { fetchFavoriteTracks } from "../../api/queries/functions/favorites";
import { useQuery } from "@tanstack/react-query";

export default function TracksScreen({
    route,
    navigation
} : TracksProps) : React.JSX.Element {

    const { query } = route.params;

    const { data: tracks, refetch, isPending } = useQuery({
        queryKey: [query],
        queryFn: () => query === QueryKeys.RecentlyPlayed ? fetchRecentlyPlayed() : fetchFavoriteTracks()
    });

    return (
        <FlatList
            contentInsetAdjustmentBehavior="automatic"
            numColumns={1}
            data={tracks}
            refreshControl={
                <RefreshControl
                    refreshing={isPending}
                    onRefresh={refetch}
                />
            }
            renderItem={({ index, item: track}) => {
                return (
                    <Track
                        navigation={navigation}
                        showArtwork
                        track={track}
                        tracklist={tracks?.slice(index, index + 50) ?? []}
                        queue="Favorite Tracks"
                    />

                )
            }}
            style={{
                overflow: 'hidden' // Prevent unnecessary memory usage
            }} 
        />
    )
}
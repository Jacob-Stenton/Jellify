import { Text } from "@/components/Global/text";
import { useApiClientContext } from "@/components/jellyfin-api-provider";
import React from "react";
import { View } from "tamagui";

export default function LibraryDetails() : React.JSX.Element {
    
    const { library } = useApiClientContext();
    
    return (
        <View>
            <Text>{ `LibraryID: ${library!.musicLibraryId}` }</Text>
            <Text>{ `Playlist LibraryID: ${library!.playlistLibraryId}` }</Text>
        </View>
    )
}
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUserPlaylists } from "../../../api/queries/playlist";
import { ItemCard } from "../../Global/components/item-card";
import { H2 } from "../../../components/Global/helpers/text";
import { StackParamList } from "../../../components/types";
import React from "react";
import { FlatList } from "react-native";
import { View, XStack, YStack } from "tamagui";
import AddPlaylistPopover from "./add-playlist-popover";

export default function Playlists({ navigation }: { navigation: NativeStackNavigationProp<StackParamList>}) : React.JSX.Element {

    const { data: playlists } = useUserPlaylists();

    return (
        <View>
            <XStack justifyContent="space-between" alignContent="center" marginHorizontal={"$2"}>
                <H2>Your Playlists</H2>

                <YStack justifyContent="center" alignContent="flex-end" marginTop={7}>
                    {/* <Icon name="plus-circle-outline" color={getToken("$color.telemagenta")} /> */}
                    <AddPlaylistPopover />
                </YStack>
            </XStack>
            <FlatList horizontal
                data={playlists}
                renderItem={({ item: playlist }) => {
                    return (
                        <ItemCard
                            item={playlist}
                            squared
                            caption={playlist.Name ?? "Untitled Playlist"}
                            onPress={() => {
                                navigation.navigate('Playlist', {
                                    playlist
                                })
                            }} />
                    )
                }} />
        </View>
    )
}
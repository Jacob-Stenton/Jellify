import React, { useEffect, useState } from "react";
import { Spacer, Spinner, XStack, YStack } from "tamagui";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { JellifyTrack } from "../../types/JellifyTrack";
import { usePlayerContext } from "../../player/provider";
import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";
import { NavigationHelpers, ParamListBase } from "@react-navigation/native";
import { BlurView } from "@react-native-community/blur";
import Icon from "../Global/icon";
import { Text } from "../Global/text";
import { Colors } from "../../enums/colors";
import { CachedImage } from "@georstat/react-native-image-cache";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { queryConfig } from "../../api/queries/query.config";
import { useApiClientContext } from "../jellyfin-api-provider";

export function Miniplayer({ navigation }: { navigation : NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> }) : React.JSX.Element {

    const playbackState = usePlaybackState();

    const activeTrack = useActiveTrack() as JellifyTrack | undefined;

    const [nowPlaying, setNowPlaying] = useState<JellifyTrack | undefined>();

    const { play, pause } = usePlayerContext();

    const { apiClient } = useApiClientContext();

    useEffect(() => {

        /**
         * When we are skipping to an index in the queue 
         * (like when a track in the middle of an album is queued),
         * prevent flickering of the first queue item.
         */
        setTimeout(() => {
            setNowPlaying(activeTrack);
        }, 500)
    }, [
        activeTrack
    ])

    return (
        <BlurView>
            { nowPlaying && (

                <XStack 
                    height={"$6"} 
                    onPress={() => navigation.navigate("Player")}
                >

                    <CachedImage
                        source={getImageApi(apiClient!)
                            .getItemImageUrlById(
                                nowPlaying!.AlbumId,
                                ImageType.Primary,
                                { ...queryConfig.images }
                            )
                        }
                        imageStyle={{
                            width: 50,
                            height: 50,
                            marginRight: 20,
                            borderRadius: 2,
                            flex: 2
                        }}
                    />

                    <YStack justifyContent="flex-start" flex={3}>
                        <Text bold>{nowPlaying?.title ?? "Nothing Playing"}</Text>
                        <Text>{nowPlaying?.artist ?? ""}</Text>
                    </YStack>

                    <Spacer />
                    
                    <XStack alignItems="flex-end" flex={1}>
                        { playbackState.state === State.Playing && (
                            <Icon name="pause" large onPress={() => pause()} />
                        )}

                        { playbackState.state === State.Paused && (
                            <Icon name="play" large onPress={() => play()} />
                        )}

                        { playbackState.state === State.Buffering || playbackState.state === State.Loading && (
                            <Spinner size="small" color={Colors.Primary}/>
                        )}

                        <Icon 
                            large
                            name="fast-forward" 
                            />
                    </XStack>
                </XStack>
            )}
        </BlurView>
    )
}
import { usePlayerContext } from "../../../player/provider";
import React from "react";
import { Separator, Spacer, View, XStack, YStack } from "tamagui";
import { Text } from "../helpers/text";
import { RunTimeTicks } from "../helpers/time-codes";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { Colors } from "../../../enums/colors";
import { CachedImage } from "@georstat/react-native-image-cache";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api/image-api";
import { QueryConfig } from "../../../api/queries/query.config";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import Icon from "../helpers/icon";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../components/types";
import Client from "../../../api/client";

interface TrackProps {
    track: BaseItemDto;
    tracklist: BaseItemDto[];
    navigation: NativeStackNavigationProp<StackParamList>;
    index: number | undefined;
    showArtwork?: boolean | undefined;
    onPress?: () => void | undefined;
}

export default function Track({
    track,
    tracklist,
    navigation,
    index,
    queueName,
    showArtwork,
    onPress,
} : {
    track: BaseItemDto,
    tracklist: BaseItemDto[],
    navigation: NativeStackNavigationProp<StackParamList>;
    index?: number | undefined,
    queueName?: string | undefined,
    showArtwork?: boolean | undefined,
    onPress?: () => void | undefined,
}) : React.JSX.Element {

    const { width } = useSafeAreaFrame();
    const { nowPlaying, usePlayNewQueue } = usePlayerContext();

    const isPlaying = nowPlaying?.item.Id === track.Id;

    return (
        <View>
            <Separator />
            <XStack 
                alignContent="center"
                flex={1}
                onPress={() => {
                    if (onPress) {
                        onPress();
                    } else {
                        usePlayNewQueue.mutate({
                            track,
                            index,
                            tracklist,
                            queueName: queueName ? queueName : track.Album ? track.Album! : "Queue"
                        });
                    }
                }}
                onLongPress={() => {
                    navigation.push("Details", {
                        item: track,
                        isNested: false
                    })
                }}
                paddingVertical={"$2"}
                marginHorizontal={"$1"}
            >
                <XStack 
                    alignContent="center" 
                    justifyContent="center" 
                    flex={1}
                    minHeight={showArtwork ? width / 9 : "unset"}
                >
                    { showArtwork ? (
                        <CachedImage
                            source={getImageApi(Client.api!)
                                .getItemImageUrlById(
                                    track.AlbumId ?? "",
                                    ImageType.Primary,
                                    { ...QueryConfig.images }
                                )
                            }
                            imageStyle={{
                                position: "relative",
                                width: width / 9,
                                height: width / 9,
                                borderRadius: 2,
                            }}
                        />
                
                    ) : (
                    <Text color={isPlaying ? Colors.Primary : Colors.White}>
                        { track.IndexNumber?.toString() ?? "" }
                    </Text>
                )}
                </XStack>

                <YStack alignContent="center" justifyContent="flex-start" flex={5}>
                    <Text 
                        bold
                        color={isPlaying ? Colors.Primary : Colors.White}
                        lineBreakStrategyIOS="standard"
                        numberOfLines={1}
                    >
                        { track.Name ?? "Untitled Track" }
                    </Text>

                    { (showArtwork || (track.ArtistCount ?? 0 > 1)) && (
                        <Text lineBreakStrategyIOS="standard" numberOfLines={1}>{ track.Artists?.join(", ") ?? "" }</Text>
                    )}
                </YStack>

                <XStack 
                    alignItems="center"
                    justifyContent="space-between" 
                    alignContent="center" 
                    flex={2}
                >
                    <YStack
                        alignContent="center"
                        justifyContent="center"
                        minWidth={24}
                    >
                        { track.UserData?.IsFavorite ? (
                            <Icon small name="heart" color={Colors.Primary} />
                        ) : (
                            <Spacer />
                        )}
                    </YStack>

                    <YStack
                        alignContent="center"
                        justifyContent="space-around"
                    >
                        <RunTimeTicks>{ track.RunTimeTicks }</RunTimeTicks>
                    </YStack>

                    <YStack
                        alignContent="center"
                        justifyContent="center"
                    >
                        <Icon small name="dots-vertical" onPress={() => {
                            navigation.push("Details", {
                                item: track,
                                isNested: false
                            });
                        }} />

                    </YStack>
                </XStack>
            </XStack>
        </View>
    )
}
import { usePlayerContext } from "@/player/provider";
import React, { useState } from "react";
import { Separator, Spacer, View, XStack, YStack } from "tamagui";
import { H5, Text } from "../helpers/text";
import { RunTimeTicks } from "../helpers/time-codes";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { Colors } from "@/enums/colors";
import { CachedImage } from "@georstat/react-native-image-cache";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api/image-api";
import { useApiClientContext } from "@/components/jellyfin-api-provider";
import { queryConfig } from "@/api/queries/query.config";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import Icon from "../helpers/icon";
import Popover from "../helpers/popover";

interface TrackProps {
    track: BaseItemDto;
    tracklist: BaseItemDto[];
    index: number | undefined;
    showArtwork?: boolean | undefined;
    onPress?: () => void | undefined
}

export default function Track({
    track,
    tracklist,
    index,
    queueName,
    showArtwork,
    onPress,
    onLongPress,
} : {
    track: BaseItemDto,
    tracklist: BaseItemDto[],
    index?: number | undefined,
    queueName?: string | undefined,
    showArtwork?: boolean | undefined,
    onPress?: () => void | undefined,
    onLongPress?: () => void | undefined,
}) : React.JSX.Element {

    const { width } = useSafeAreaFrame();
    const { apiClient } = useApiClientContext();
    const { nowPlaying, usePlayNewQueue } = usePlayerContext();

    const isPlaying = nowPlaying?.item.Id === track.Id;

    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    return (
        <View>
            <Separator />

            <Popover 
                open={popoverOpen}
                anchor={(
                    <XStack 
                        alignContent="center"
                        flex={1}
                        onLongPress={() => {

                            setPopoverOpen(true)

                            if (onLongPress) {
                                onLongPress();
                            } else {

                            }
                        }}
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
                                    source={getImageApi(apiClient!)
                                        .getItemImageUrlById(
                                            track.AlbumId ?? "",
                                            ImageType.Primary,
                                            { ...queryConfig.images }
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

                        <YStack alignContent="center" justifyContent="flex-start" flex={6}>
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
                            flex={1}
                        >
                            <YStack
                                alignContent="center"
                                justifyContent="center"
                            >
                                { track.UserData?.IsFavorite ? (
                                    <Icon small name="heart" color={Colors.Primary} />
                                ) : (
                                    <Spacer />
                                )}
                            </YStack>

                            <YStack
                                alignContent="center"
                                justifyContent="center"
                            >
                                <RunTimeTicks>{ track.RunTimeTicks }</RunTimeTicks>
                            </YStack>
                        </XStack>
                    </XStack>
            )}>
                <XStack backgroundColor={Colors.Background}>
                    <H5>{ track.Name ?? "Untitled Track" }</H5>
                </XStack>
            </Popover>
        </View>
    )
}
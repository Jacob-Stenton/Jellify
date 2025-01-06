import { Event, useTrackPlayerEvents } from "react-native-track-player";
import { handlePlayerError } from "./helpers/error-handlers";
import { usePlayerContext } from "../../player/provider";
import { XStack, YStack } from "tamagui";
import { CachedImage } from "@georstat/react-native-image-cache";
import { useApiClientContext } from "../jellyfin-api-provider";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { queryConfig } from "../../api/queries/query.config";
import { Text } from "../Global/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { playPauseButton } from "./helpers/buttons";
import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";
import { NavigationHelpers, ParamListBase } from "@react-navigation/native";
import { HorizontalSlider } from "../Global/slider";

export default function Player({ navigation }: { navigation : NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> }): React.JSX.Element {

    const { apiClient } = useApiClientContext();
    const { queue, playbackState, nowPlaying, play, pause, progress } = usePlayerContext();

    return (
        <SafeAreaView>
            { nowPlaying && (
                <YStack alignItems="center">

                    <XStack alignItems="center">

                        <CachedImage
                            source={getImageApi(apiClient!)
                                .getItemImageUrlById(
                                    nowPlaying!.AlbumId,
                                    ImageType.Primary,
                                    { ...queryConfig.playerArtwork }
                                )
                            }
                            imageStyle={{
                                position: "relative",
                                width: 400,
                                height: 400,
                                borderRadius: 2
                            }}
                            />
                    </XStack>

                    <XStack 
                        justifyContent="flex-start"
                        marginHorizontal={10}
                    >

                        <YStack alignContent="flex-start">
                            <Text>{nowPlaying?.title ?? "Untitled Track"}</Text>
                            <Text 
                                bold
                                onPress={() => {
                                    navigation.navigate("Artist", {
                                        artistName: nowPlaying.artist,
                                        artistId: nowPlaying.ArtistId
                                    })
                                }}
                            >
                                {nowPlaying.artist ?? "Unknown Artist"}</Text>
                        </YStack>

                        <XStack>
                            {/* Buttons for favorites, song menu go here */}

                        </XStack>

                    </XStack>

                    <XStack>
                        {/* playback progress goes here */}
                        <HorizontalSlider 
                            value={progress!.position}
                            max={progress!.duration}
                            width={400}
                        />

                    </XStack>

                    <XStack>
                        {playPauseButton(playbackState, play, pause)}
                    </XStack>

                    
                    </YStack>
            )}
        </SafeAreaView>
    );
}
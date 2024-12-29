import React, { useEffect } from "react";
import { H5, ScrollView, View } from "tamagui";
import { useHomeContext } from "../provider";
import { H2, Text } from "../../Global/text";
import { Card } from "../../Global/card";
import { play } from "react-native-track-player/lib/src/trackPlayer";
import { mapDtoToTrack } from "../../../helpers/mappings";
import { useApiClientContext } from "../../jellyfin-api-provider";
import { usePlayerContext } from "../../../player/provider";

export default function RecentlyPlayed(): React.JSX.Element {

    const { addToQueue, resetQueue } = usePlayerContext();
    const { apiClient, sessionId } = useApiClientContext();
    const { recentTracks } = useHomeContext();

    useEffect(() => {
        console.log("Recently played", recentTracks);
    }, [
        recentTracks
    ])

    return (
        <View>
            <H2>Play it again</H2>
            <ScrollView horizontal>
                { recentTracks && recentTracks.map((recentlyPlayedTrack) => {
                    return (
                        <Card
                            caption={
                                <>
                                    <H5 
                                        numberOfLines={1}
                                        textBreakStrategy="simple"
                                        lineBreakStrategyIOS="standard"
                                        width={150}
                                    >
                                        {`${recentlyPlayedTrack.Name}`}
                                    </H5>
                                    <Text>{`${recentlyPlayedTrack.Artists?.join(", ")}`}</Text>
                                </>
                            }
                            cornered
                            itemId={recentlyPlayedTrack.AlbumId!}
                            marginRight={20}
                            onPress={async () => {
                                await resetQueue(false);
                                await addToQueue([mapDtoToTrack(apiClient!, sessionId, recentlyPlayedTrack)])
                                play();
                            }}
                        >
                                
                        </Card>
                    )
                })}
            </ScrollView>
        </View>
    )
}
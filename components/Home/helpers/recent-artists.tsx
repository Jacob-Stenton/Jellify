import React, { useEffect } from "react";
import { ScrollView, View, YStack } from "tamagui";
import { useApiClientContext } from "../../jellyfin-api-provider";
import { Colors } from "../../../enums/colors";
import { useHomeContext } from "../provider";
import { H2, Text } from "../../helpers/text";
import { ProvidedHomeProps } from "../types";
import Avatar from "../../helpers/avatar";

export default function RecentArtists({ navigation }: ProvidedHomeProps): React.JSX.Element {

    const { server } = useApiClientContext();
    const { recentArtists } = useHomeContext();

    useEffect(() => {
        console.log("Recently played artists", recentArtists);
    }, [
        recentArtists
    ])

    return (
        <View>
            <H2>Recent Artists</H2>
            <ScrollView horizontal>
                { recentArtists && recentArtists.map((recentArtist) => {
                    return (
                        <YStack
                            height={150}
                            paddingHorizontal={10} 
                            alignItems="center"
                        >
                            <Avatar 
                                circular
                                itemId={recentArtist.Id!} 
                                onPress={() => 
                                    navigation.navigate('Artist', 
                                        { 
                                            artistId: recentArtist.Id!, 
                                            artistName: recentArtist.Name ?? "Unknown Artist" 
                                        }
                                    )}>
                                {`${recentArtist!.Name}`}
                            </Avatar>
                        </YStack>
                    )
                })}
            </ScrollView>
        </View>
    )
}
import React, { useEffect } from "react";
import { Avatar, ScrollView, View, YStack } from "tamagui";
import { useApiClientContext } from "../../jellyfin-api-provider";
import { Colors } from "../../../enums/colors";
import { useHomeContext } from "../provider";
import { H2, Text } from "../../helpers/text";

export default function RecentArtists(): React.JSX.Element {

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
                        gap="$4" 
                        alignContent="center"
                        justifyContent="center"
                        padding="$3"
                        width="$20"
                        >
                            <Avatar circular size="$10">
                                <Avatar.Image src={`${server!.url}/Items/${recentArtist.Id!}/Images/Primary`} />
                                <Avatar.Fallback backgroundColor={Colors.Primary}/>
                            </Avatar>
                            <Text alignCenter>{`${recentArtist!.Name}`}</Text>
                        </YStack>
                    )
                })}
            </ScrollView>
        </View>
    )
}
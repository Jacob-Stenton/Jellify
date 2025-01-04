import { ScrollView } from "tamagui";
import Avatar from "../Global/avatar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useArtistAlbums } from "../../api/queries/artist";
import { useApiClientContext } from "../jellyfin-api-provider";
import { FlatList } from "react-native";
import { Card } from "../Global/card";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { H4, H5 } from "../Global/text";
import { useState } from "react";

interface ArtistProps {
    artistId: string,
    artistName: string,
    navigation: NativeStackNavigationProp<StackParamList>
}

export default function Artist(props: ArtistProps): React.JSX.Element {

    const [columns, setColumns] = useState<number>(2);

    const { apiClient } = useApiClientContext();

    const { data: albums } = useArtistAlbums(props.artistId, apiClient!);

    return (
        <SafeAreaView>
            <ScrollView 
                alignContent="center" 
                contentInsetAdjustmentBehavior="automatic"
            >
                <Avatar itemId={props.artistId} />

                <H4>Albums</H4>
                <FlatList
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: "flex-start"
                    }}
                    data={albums}
                    numColumns={columns} // TODO: Make this adjustable
                    renderItem={({ item: album }) => {
                        return (
                            <Card
                                caption={album.Name}
                                subCaption={album.ProductionYear?.toString()}
                                marginHorizontal={10}
                                width={500 / columns}
                                cornered 
                                itemId={album.Id!}
                                onPress={() => {
                                    props.navigation.navigate('Album', {
                                        album
                                    })
                                }}
                            />
                        )
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}
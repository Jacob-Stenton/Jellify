import { SafeAreaView } from "react-native-safe-area-context";
import { StackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, Separator, Stack, View, YStack } from "tamagui";
import { CachedImage } from "@georstat/react-native-image-cache";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { useApiClientContext } from "../jellyfin-api-provider";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { queryConfig } from "../../api/queries/query.config";
import { H4, Text } from "../Global/text";
import { FlatList } from "react-native";
import { useAlbumTracks } from "../../api/queries/album";
import { usePlayerContext } from "../../player/provider";
import { mapDtoToTrack } from "../../helpers/mappings";

interface AlbumProps {
    albumId: string,
    albumName?: string | null | undefined;
    navigation: NativeStackNavigationProp<StackParamList>;
}

export default function Album(props: AlbumProps): React.JSX.Element {

    const { apiClient, sessionId } = useApiClientContext();

    const { resetQueue, addToQueue, play } = usePlayerContext();

    const { data: tracks, isLoading } = useAlbumTracks(props.albumId, apiClient!);

    return (
        <ScrollView fullscreen alignItems="center">
                <CachedImage
                    source={getImageApi(apiClient!)
                        .getItemImageUrlById(
                            props.albumId,
                            ImageType.Primary,
                            { ...queryConfig.images})}
                    imageStyle={{
                        position: "relative",
                        width: 300,
                        height: 300,
                        borderRadius: 2
                    }}
                />

                <YStack>
                    <H4>{ props.albumName ?? "Untitled Album" }</H4>
                </YStack>
                <FlatList
                    data={tracks}
                    numColumns={1}
                    renderItem={({ item: track, index }) => {
                        return (
                            <View>
                                <Separator />
                                <Stack 
                                    flex={1}
                                    onPress={async (track) => {
                                        await resetQueue(false)
                                        await addToQueue(tracks!.map((track) => mapDtoToTrack(apiClient!, sessionId, track)));
                                        play(index);
                                    }
                                }>
                                    <Stack alignItems="flex-start">
                                        <Text>{ track.IndexNumber?.toString() ?? "" }</Text>
                                        <Text>{ track.Name ?? "Untitled Track" }</Text>
                                    </Stack>

                                    <Stack alignItems="flex-end">
                                        <Text>{ track.RunTimeTicks?.toString() ?? "" }</Text>
                                    </Stack>
                                </Stack>
                            </View>
                        )

                    }}/>
            </ScrollView>
    )
}
import { StackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, YStack, XStack } from "tamagui";
import { CachedImage } from "@georstat/react-native-image-cache";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { useApiClientContext } from "../jellyfin-api-provider";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { queryConfig } from "../../api/queries/query.config";
import { H4, H5, Text } from "../Global/helpers/text";
import { FlatList } from "react-native";
import { usePlayerContext } from "../../player/provider";
import RunTimeTicks from "../Global/helpers/runtimeticks";
import Track from "../Global/components/track";
import { useItemTracks } from "@/api/queries/tracks";

interface AlbumProps {
    album: BaseItemDto,
    navigation: NativeStackNavigationProp<StackParamList>;
}

export default function Album(props: AlbumProps): React.JSX.Element {

    const { apiClient, sessionId } = useApiClientContext();

    const { nowPlaying } = usePlayerContext();

    const { data: tracks, isLoading } = useItemTracks(props.album.Id!, apiClient!, true);

    return (
        <ScrollView>
                <YStack alignItems="center">
                    <CachedImage
                        source={getImageApi(apiClient!)
                            .getItemImageUrlById(
                                props.album.Id!,
                                ImageType.Primary,
                                { ...queryConfig.images})}
                        imageStyle={{
                            position: "relative",
                            width: 300,
                            height: 300,
                            borderRadius: 2
                        }}
                    />

                    <H4>{ props.album.Name ?? "Untitled Album" }</H4>
                    <H5>{ props.album.ProductionYear?.toString() ?? "" }</H5>
                </YStack>
                <FlatList
                    data={tracks}
                    extraData={nowPlaying}
                    numColumns={1}
                    renderItem={({ item: track, index }) => {

                        return (
                            <Track
                                track={track}
                                tracklist={tracks!}
                                index={index}
                            />
                        )

                }}/>

                <XStack justifyContent="flex-end">
                    <Text 
                        color={"$gray10"} 
                        style={{ display: "block"}}
                    >
                        Total Runtime:
                    </Text>
                    <RunTimeTicks>{ props.album.RunTimeTicks }</RunTimeTicks>
                </XStack>
            </ScrollView>
    )
}
import { useItem } from "../../../api/queries/item";
import Icon from "../../../components/Global/helpers/icon";
import { StackParamList } from "../../../components/types";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { XStack } from "tamagui";

export default function TrackOptions({ 
    item, 
    navigation 
} : { 
    item: BaseItemDto, 
    navigation: NativeStackNavigationProp<StackParamList> 
}) : React.JSX.Element {

    const { data: album, isSuccess } = useItem(item.AlbumId ?? "")
    
    return (
        <XStack justifyContent="space-between">

            { isSuccess && (
                <Icon 
                    name="music-box"
                    onPress={() => {
                        navigation.navigate("Album", {
                            album
                        })
                    }}
                />
            )}

            <Icon 
                name="table-column-plus-before" 
            />

            <Icon 
                name="table-column-plus-after" 
            />
        </XStack>
    )
}
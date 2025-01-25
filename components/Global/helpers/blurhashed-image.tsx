import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { useItemImage } from "../../../api/queries/image";
import { Blurhash } from "react-native-blurhash";
import { Image, View } from "tamagui";
import { isEmpty } from "lodash";

interface BlurhashLoadingProps {
    item: BaseItemDto;
    width: number;
    height?: number;
    type?: ImageType; 
}

export default function BlurhashedImage({ 
    item, 
    width, 
    height,
    type 
} : BlurhashLoadingProps) : React.JSX.Element {

    const { data: image, isSuccess } = useItemImage(item.Id!, type, width, height ?? width);

    const blurhash = !isEmpty(item.ImageBlurHashes) 
        && !isEmpty(type ? item.ImageBlurHashes[type] : item.ImageBlurHashes.Primary) 
        ? Object.values(type ? item.ImageBlurHashes[type]! : item.ImageBlurHashes.Primary!)[0]
        : undefined;

    return (
        <View minHeight={height ?? width} minWidth={width}>

            { isSuccess ? (
                <Image 
                    source={{
                        uri: image
                    }}
                    style={{
                        height: height ?? width,
                        width,
                    }} 
                />
            ) : blurhash && (
                <Blurhash blurhash={blurhash!} style={{ flex: 1 }} />
            )
        }
        </View>
    )
}
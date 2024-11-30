import React, { ReactNode, useState } from "react";
import type { CardProps as TamaguiCardProps } from "tamagui"
import { H3, Card as TamaguiCard, ZStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { useApiClientContext } from "../jellyfin-api-provider";
import { cardDimensions } from "./component.config";
import { useImage } from "../../api/queries/image";
import { Colors } from "../../enums/colors";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { CachedImage } from "@georstat/react-native-image-cache";
import { queryConfig } from "../../api/queries/query.config";
import { Blurhash } from "react-native-blurhash";

interface CardProps extends TamaguiCardProps {
    artistName?: string;
    blurhash?: string;
    children?: string;
    itemId: string;
    footer?: ReactNode;
}

export function Card(props: CardProps) {

    console.log(`${props.artistName} ${props.blurhash}`)

    const { apiClient } = useApiClientContext();
    const { data, isPending, isSuccess } = useImage(apiClient!, props.itemId)

    const [imageLoaded, setImageLoaded] = useState<boolean>(false); 
    const dimensions = props.artistName ? cardDimensions.artist : cardDimensions.album;
    const imageDimensions = props.artistName ? queryConfig.images.artist : queryConfig.images.album;

    return (
        <TamaguiCard 
            elevate 
            size="$4" 
            animation="bouncy"
            hoverStyle={props.onPress ? { scale: 0.925 } : {}}
            pressStyle={props.onPress ? { scale: 0.875 } : {}}
            borderRadius={25}
            {...dimensions}
            {...props}
        >
            <TamaguiCard.Header padded>
            { props.children && (
                <H3>{ props.children }</H3>
            )}
            </TamaguiCard.Header>
            <TamaguiCard.Footer padded>
            { props.footer && (
                props.footer
            )}
            </TamaguiCard.Footer>
            <TamaguiCard.Background>
                {props.blurhash && (
                    <Blurhash
                        decodeWidth={dimensions.width}
                        decodeHeight={dimensions.height}
                        blurhash={props.blurhash}
                    />
                )}
            </TamaguiCard.Background>
        </TamaguiCard>
    )
  }
  
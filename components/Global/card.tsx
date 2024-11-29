import { ReactNode } from "react";
import type { CardProps as TamaguiCardProps } from "tamagui"
import { H3, Image, Card as TamaguiCard, ZStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { useApiClientContext } from "../jellyfin-api-provider";
import { cardDimensions } from "./component.config";
import { useItemImage } from "../../api/queries/image";
import { Colors } from "../../enums/colors";

export enum CardType {
    Artist = "ARTIST",
    Album = "ALBUM"
}

interface CardProps extends TamaguiCardProps {
    cardType?: CardType;
    children?: string;
    itemId: string;
    footer?: ReactNode;
}

export function Card(props: CardProps) {

    const { apiClient } = useApiClientContext();
    const { data, isPending } = useItemImage(apiClient!, props.itemId)

    const dimensions = props.cardType === CardType.Artist ? cardDimensions.artist : cardDimensions.album;

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
                <ZStack>
                    <LinearGradient
                        colors={[isPending ? Colors.Primary : "$colorTransparent", "$black4"]}
                        start={[1, 1]}
                        end={[0,0]}
                    />

                    { data && (
                        <Image
                        alignSelf="center"
                        source={{
                            uri: data
                        }} />
                    )}
                </ZStack>
            </TamaguiCard.Background>
        </TamaguiCard>
    )
  }
  
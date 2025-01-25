import React, {  } from "react";
import { useTheme, View, XStack, YStack } from "tamagui";
import { usePlayerContext } from "../../player/provider";
import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";
import { NavigationHelpers, ParamListBase } from "@react-navigation/native";
import Icon from "../Global/helpers/icon";
import { Text } from "../Global/helpers/text";
import { Colors } from "../../enums/colors";
import { CachedImage } from "@georstat/react-native-image-cache";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { QueryConfig } from "../../api/queries/query.config";
import TextTicker from 'react-native-text-ticker';
import PlayPauseButton from "./helpers/buttons";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import Client from "../../api/client";
import { TextTickerConfig } from "./component.config";

export function Miniplayer({ navigation }: { navigation : NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> }) : React.JSX.Element {

    const theme = useTheme();

    const { nowPlaying, useSkip } = usePlayerContext();

    const { width } = useSafeAreaFrame();

    return (
        <View style={{ 
            backgroundColor: theme.background.val, 
            borderColor: theme.borderColor.val
        }}>
            { nowPlaying && (

                <XStack 
                    alignItems="center"
                    margin={0}
                    padding={0}
                    height={"$6"} 
                    onPress={() => navigation.navigate("Player")}
                >
                    <YStack
                        alignContent="center"
                        flex={1}>
                        <CachedImage
                            source={getImageApi(Client.api!)
                                .getItemImageUrlById(
                                    nowPlaying!.item.AlbumId ?? "",
                                    ImageType.Primary,
                                    { ...QueryConfig.images }
                                )
                            }
                            imageStyle={{
                                position: "relative",
                                width: width / 7,
                                height: width / 7,
                                borderRadius: 2,
                            }}
                        />

                    </YStack>


                    <YStack 
                        alignContent="flex-start" 
                        marginLeft={"$0.5"}
                        flex={4} 
                        maxWidth={"$20"}
                    >
                        <TextTicker {...TextTickerConfig}>
                            <Text bold>{nowPlaying?.title ?? "Nothing Playing"}</Text>
                        </TextTicker>

                        <TextTicker {...TextTickerConfig}>
                            <Text color={Colors.Primary}>{nowPlaying?.artist ?? ""}</Text>
                        </TextTicker>
                    </YStack>
                    
                    <XStack 
                        justifyContent="flex-end" 
                        flex={2}
                    >
                        <PlayPauseButton />

                        <Icon 
                            large
                            name="skip-next" 
                            onPress={() => useSkip.mutate(undefined)}
                            />
                    </XStack>
                </XStack>
            )}
        </View>
    )
}
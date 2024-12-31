import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { JellifyTrack } from "../types/JellifyTrack";
import { TrackType } from "react-native-track-player";
import { Api } from "@jellyfin/sdk";
import { QueuingType } from "../enums/queuing-type";
import querystring from "querystring"

const container = "opus,mp3,aac,m4a,flac,webma,webm,wav,ogg,mpa,wma";

// TODO: Make this configurable
const transcodingContainer = "m4a";

export function mapDtoToTrack(api: Api, sessionId: string, item: BaseItemDto, queuingType?: QueuingType) {

    console.debug(`Mapping item to track: ${item.Id}, ${item.AlbumId}`)

    const urlParams = {
        "Container": container,
        "TranscodingContainer": transcodingContainer,
        "TranscodingProtocol": "hls",
        "EnableRemoteMedia": true,
        "EnableRedirection": true,
        "api_key": api.accessToken,
        "StartTimeTicks": 0,
        "PlaySessionId": sessionId,
    }

    return {
        url: `${api.basePath}/Audio/${item.Id!}/universal?${querystring.stringify(urlParams)}`,
        type: TrackType.HLS,
        headers: {
            "X-Emby-Token": api.accessToken
        },
        title: item.Name,
        album: item.Album,
        artist: item.Artists?.join(", "),
        duration: item.RunTimeTicks,

        ItemId: item.Id!,
        AlbumId: item.AlbumId!,
        QueuingType: queuingType ?? QueuingType.DirectlyQueued
    } as JellifyTrack
}
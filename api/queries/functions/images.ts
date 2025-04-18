import { ImageFormat, ImageType } from "@jellyfin/sdk/lib/generated-client/models"
import { getImageApi } from "@jellyfin/sdk/lib/utils/api"
import _ from "lodash"
import Client from "../../../api/client"

export function fetchItemImage(itemId: string, imageType: ImageType, width: number, height: number) {
    
    return new Promise<string>(async (resolve, reject) => {
        console.debug("Fetching item image");

        if (!!!Client.api) 
            return reject("Client instance not set")
        else
            getImageApi(Client.api)
                .getItemImage({
                    itemId,
                    imageType,
                    width: Math.ceil(width / 100) * 100 * 2, // Round to the nearest 100 for simplicity and to avoid 
                    height: Math.ceil(height / 100) * 100 * 2, // redundant images in storage, then double it to make sure it's crispy
                    format: ImageFormat.Png
                },
                {
                    responseType: 'blob',
                })
            .then(async (response) => {

                if (response.status < 300) {

                    return resolve(await blobToBase64(response.data))
                } else {
                    return reject("Invalid image response");
                }
            }).catch((error) => {
                console.error(error);
                reject(error);
            })
    });
}

function blobToBase64(blob : Blob) {
    return new Promise<string>((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }
export interface SliderImageType {
    _id: string
    image: string
}

export interface ISlideShows extends SliderImageType {
  imageType?: string
  imageSize?: string
  imageDimensions?: string
}

export type DeliveryPrices = {
    name: string
    price: string
}[];
export interface ImgData {
    data: Img[]
}
export interface Img {
    img: string,
    thumbImg: string,
    time: string,
    type: string,
    url: string
}

export interface PhotoData {
    [timeS: string]: Img[]
}

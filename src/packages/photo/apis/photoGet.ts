import axios from 'axios'
import { ImgData } from '../interfaces'



export const getPhotoRand =  async (): Promise<ImgData> => {
    let res: any = await axios.get("http://122.51.5.63:777/photo/query_rand");
    let ret: ImgData = res.data;
    return ret;
}
export const getPhoto =  async (type: string, time: string, page: string): Promise<ImgData> => {
    let res: any = await axios.get("http://122.51.5.63:777/photo/query?type="+type+"&time="+time+"&page="+page);
    let ret: ImgData = res.data;
    return ret;
}



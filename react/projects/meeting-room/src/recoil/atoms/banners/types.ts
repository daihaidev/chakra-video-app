export interface BannerModel {
  id: string;
  message: string;
  published: boolean;
}

export interface BannerIdsSetterAction {
  name: string;
  id?: string;
  attributes: {
    published: boolean
  }
  banners: BannerModel[]
}
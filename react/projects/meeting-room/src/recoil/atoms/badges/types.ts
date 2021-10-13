export interface BadgeModel {
  id: string;
  title: string;
  description: string;
  currentPrice: string;
  oldPrice: string;
  email: string;
  image: string;
  published: boolean;
  sellerEmail: string;
  buttonText: string;
  checkoutUrl: string;
}

export interface BadgeIdsSetterAction {
  name: string;
  id?: string;
  attributes: {
    published: boolean
  }
  badges: BadgeModel[]
}
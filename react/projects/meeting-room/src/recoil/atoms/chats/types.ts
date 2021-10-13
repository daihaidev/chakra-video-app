import { DefaultValue } from "recoil";
import { UserModel } from "../users/types";

export interface ChatModel {
  id: string;
  author: UserModel;
  timestamp: string;
  message: string;
  published: boolean;
}

export interface ChatIdsSetterAction extends DefaultValue {
  name: string;
  id?: string;
  attributes: {
    published: boolean
  }
  chats: ChatModel[]
}
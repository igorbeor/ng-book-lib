import { BookFields } from "./book";

interface ParserConfigBase {
  listElement: string;
  itemElement: string;
}

export interface ParserConfig extends ParserConfigBase {
  fields: ParserConfigFields;
}

export type ParserConfigFields = {
  [key in BookFields]: ParserConfigField;
};


export interface ParserConfigField {
  element: string;
  attribute: string;
}

// data/members.ts
import { apiUrls } from "../constants/api"; // adjust path as per your folder
const SHEET_API_URL = apiUrls.memberUrl; // Use the expencesUrl for saving expenses
export interface Menu {
  sno: number;
  itemname: string;
  price: number;
  catname: string;
  info:string;
}
export interface Menuold {
  id: number;
  name: string;
  price: number;
  category: string;
}
// call api to bind menu  

export async function fetchMenu(): Promise<Menu[]> {
  try {
    const res = await fetch(`${SHEET_API_URL}?requestName=showMenu`);
    if (!res.ok) throw new Error("Network error");
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch menu:", err);
    return [];
  }
}
//  export const menuold: Menuold[] = [
//    { id: 1, name: 'Grilled Chicken Wrap', price: 140, category: 'Non-Veg Wraps' }];


// data/members.ts
import { apiUrls } from "../constants/api"; // adjust path as per your folder
const apiUrl = apiUrls.memberUrl; // Use the member URL for fetching members
export interface Member {
  id: number;
  name: string;
  mobile: string;
  balance: number;
}

// export const members: Member[] = [
//   { id: 101, name: "Naresh Kumar", mobile: "8750503366", balance: 500 },
//   { id: 102, name: "Vipin Bhati", mobile: "8860060063", balance: 1200.5 },
//   { id: 103, name: "Ankit", mobile: "9990993328", balance: 50 },
// ];

// call get api to get members from backend pass a variable to get members from backend

export async function fetchMembers(): Promise<Member[]> {
  try {
    const response = await fetch(
     apiUrl+"?type=showMembers"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.members as Member[];
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return [];
  }
}

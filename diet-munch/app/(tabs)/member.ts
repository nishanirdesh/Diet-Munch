// data/members.ts

export interface Member {
  id: number;
  name: string;
  mobile: string;
  balance: number;
}

export const members: Member[] = [
  { id: 101, name: "Naresh Kumar", mobile: "8750503366", balance: 500 },
  { id: 102, name: "Vipin Bhati", mobile: "8860060063", balance: 1200.5 },
  { id: 103, name: "Ankit", mobile: "9990993328", balance: 50 },
];

// call get api to get members from backend pass a variable to get members from backend

export async function fetchMembers(): Promise<Member[]> {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxjvrnIIwfV8ivasA27i8-hxTs79QlrMsdqYM6yRGykR4Z2r4xtDELChpk2OA48Yo2D/exec?type=showMembers"
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

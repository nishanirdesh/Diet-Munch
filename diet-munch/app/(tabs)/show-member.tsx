import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { apiUrls } from "../constants/api"; // adjust path as per your folder
const apiUrl=apiUrls.memberUrl; // Use the saveMember URL for saving bills
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
}
type Member = {
 sno: string | number;
  name: string;
  mobile?: string;
  dob: string ;
  job: string;
  location: string;
    amount: string | number;
  ismonthly: number;
  requestName: string;
};

type MemberItem = {
  sno: string | number;
  name: string;
  mobile?: string;
  dob: string ;
  job: string;
  location: string;
    amount: string | number;
  ismonthly: number;
  requestName: string;
};
type MemberItemEdit = {
  sno: string | number;
  name: string;
  mobile?: string;
  dob: string ;
  job: string;
  location: string;
    amount: number;
  ismonthly: number;
  requestName: string;
  oldAmount: number;
};
export default function TableExpenseScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState(new Date());
   const [job, setJob] = useState("");
    const [location, setLocation] = useState("");
     const [amount, setAmount] = useState("");
     const [ismonthly, setIsMonthly] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
 
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MemberItemEdit | null>(null);
 const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
  const [allMembers, setAllMembers] =useState<MemberItemEdit[]>([]);
const [filteredMembers, setFilteredMembers] = useState<MemberItemEdit[]>([]);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    fetchExpenses();
       fetch(apiUrl+ "?requestName=showMembers")
      .then((res) => res.json())
      .then((data: Member[]) => {
        
        const formatted = data.map((member) => ({
          
  label: member.name,
  value: String(member.sno), // 👈 force value to be a string
}));
// Insert "All Members" at the top
const withAllOption = [
  { label: "All Members", value: "ALL" }, // 👈 special value
  ...formatted
];

        setItems(withAllOption);
 
      })
      .catch((error) => {
        console.error("Failed to load members:", error);
        Alert.alert("Error", "Unable to load member list.");
      });
  }, []);
 


  const fetchExpenses = async () => {
    try {
      const res = await fetch(apiUrl+ "?requestName=showMembers");
      const data = await res.json();
   setAllMembers(data);
  setFilteredMembers(data); // start by showing all
  
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExpenses();
  }, []);

const handelCancel = () => {
  if (editingItem) {
    setEditingItem({    
      ...editingItem,
      amount: editingItem.oldAmount // Reset to old amount
    });
  }
}
  const handleEdit = (item: MemberItemEdit) => {
    item.requestName = "UpdateMember"; // Set requestName for edit
    item.oldAmount = item.amount; // Store old amount for comparison
    item.amount = 0; // Reset amount for editing
    setEditingItem(item);
    setEditModalVisible(true);
  };
const handleSelectMember = (selectedValue: string | null) => {
  if (!selectedValue || selectedValue === "ALL") {
    setFilteredMembers(allMembers); // Show all members
  } else {
    setFilteredMembers(allMembers.filter(m => String(m.sno) === selectedValue));
  }
};
// set amount on cancel button

  const mobileRegex = /^[6-9]\d{9}$/;

  const handleSave = async () => {
    if (!editingItem) return;
   const oldAmount = editingItem.oldAmount;
   const total=editingItem.amount+editingItem.oldAmount;
editingItem.amount=editingItem.amount+editingItem.oldAmount;
    try {
      if(total<=oldAmount)
      {
        Alert.alert("Validation Error", "Amount cannot be less than or equal to old amount.");
        return;
      }
  
      const mobileRegex = /^[6-9]\d{9}$/; // Indian format
      // check mobile not empty and valid
      if (!editingItem.mobile || editingItem.mobile === "") {
        Alert.alert("Validation Error", "Please enter a valid mobile number.");
        return;
      }
      //check amount not empty and valid
      if (isNaN(editingItem.amount) || editingItem.amount <= 0)
      {
        Alert.alert("Validation Error", "Please enter a valid amount.");
        return;
      }
 if (!mobileRegex.test((editingItem.mobile ?? '').toString())) 
    {
    Alert.alert("Invalid Mobile Number", "Please enter a valid 10-digit mobile number edit.");
    return;
  }
  console.log("Saving item:", JSON.stringify(editingItem));
    setLoading(true); // ✅ Show loader
      const response = await fetch(apiUrl+"?requestName=UpdateMember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      await response.text();
      setEditModalVisible(false);
      
       setLoading(false); // ✅ Hide loader after save

      Alert.alert("Success", "Data updated successfully!");
 onRefresh(); // Refresh the list after saving
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };
return (
  <>
<View style={styles.headerContainer}>
      <Text style={styles.title}>BMYB Members</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-member")} // Path to Add Member page
      >
        <Text style={styles.addButtonText}>+ Add Member</Text>
      </TouchableOpacity>
    </View>

    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      searchable={true}
      searchPlaceholder="Search member..."
      placeholder="Select a member"
      zIndex={3000}
      zIndexInverse={1000}
      onChangeValue={handleSelectMember}
    />

    {loading ? (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    ) : (
      <FlatList
        data={filteredMembers}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>SNo</Text>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Mobile</Text>
            <Text style={styles.headerCell}>Amount</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const backgroundColor =
            item.ismonthly === 1 ? "#d4edda" : "#f8d7da";

          return (
            <TouchableOpacity
              onPress={() => handleEdit(item)}
              style={[styles.row, { backgroundColor }]}
            >
              <Text style={styles.cell}>{item.sno}</Text>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.mobile}</Text>
               <Text style={styles.cell}>{item.amount}</Text>
            </TouchableOpacity>
          );
        }}
      />
    )}

    {/* Modal */}
    <Modal visible={editModalVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Wallet</Text>
          <Text style={styles.label}>Mobile</Text>
 <TextInput
            style={styles.input}
            value={editingItem?.mobile?.toString()}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={(text) => {
              const cleanedText = text.replace(/[^0-9]/g, "");
              setEditingItem(
                (prev) => prev && { ...prev, mobile: cleanedText }
              );

              if (
                cleanedText.length === 10 &&
                !mobileRegex.test(cleanedText)
              ) {
                Alert.alert(
                  "Invalid Mobile Number",
                  "Must start with 6–9 and be 10 digits."
                );
              }
            }}
          />
       
            <Text style={styles.label}>Wallet Amount</Text>
             <TextInput
            style={styles.input}
             keyboardType="numeric"
             editable={false} // Make it read-only
            value={editingItem?.oldAmount?.toString()}
            onChangeText={(text) =>
              setEditingItem((prev) => prev && { ...prev, oldAmount: Number(text) })
            }
          />
               <Text style={styles.label}>Amount</Text>
             <TextInput
            style={styles.input}
             keyboardType="numeric"
             

            onChangeText={(text) =>
              setEditingItem((prev) => prev && { ...prev, amount: Number(text) })
            }
          />
            
         

         

        

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={(handelCancel) => setEditModalVisible(false)}
              style={[styles.button, { backgroundColor: "#ccc" }]}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            {loading ? (
              <ActivityIndicator size="large" color="#007bff" />
            ) : (
              <Button title="Save" onPress={handleSave} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  </>
);


}

const styles = StyleSheet.create({
  headerContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},


addButton: {
  backgroundColor: "#007bff",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 5,
},

addButtonText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "bold",
},

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 5, backgroundColor: "#fff" },
  row: { flexDirection: "row", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#ddd" },
  headerRow: { backgroundColor: "#007bff" },
  headerCell: { flex: 1, fontWeight: "bold", color: "#fff", textAlign: "left", fontSize: 12 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  cell: { flex: 1, textAlign: "left", fontSize: 12, color: "#333" },
  filterContainer: { flexDirection: "row", justifyContent: "space-evenly", paddingVertical: 8, backgroundColor: "#f0f0f0" },
  picker: { flex: 1, height: 50 },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  modalContent: { margin: 20, backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", marginVertical: 8, padding: 10, borderRadius: 5 },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 10 },
  button: { padding: 10, borderRadius: 5 },checkbox: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
  },
});
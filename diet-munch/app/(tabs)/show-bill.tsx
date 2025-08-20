import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { apiUrls } from "../constants/api"; // adjust path as per your folder
const apiUrl=apiUrls.memberUrl; // Use the saveMember URL for saving bills
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g. Aug
  return `${day}-${month}`;
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

type ShowBill = {
  billNo: string;
  customer_type: string;
  customer_name: string;
  customer_mobile: string ;
  balance_after: string;
  bill_date: string;
  bill_amount: string;
  requestName: string;
  member_id: string | number;
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
  const [editingItem, setEditingItem] = useState<ShowBill | null>(null);
 const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
  const [allMembers, setAllMembers] =useState<ShowBill[]>([]);
const [filteredMembers, setFilteredMembers] = useState<ShowBill[]>([]);
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
      const res = await fetch(apiUrl+ "?requestName=showBill");
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
  const totalAmount = filteredMembers.reduce((sum, item) => {
    const amt = typeof item.bill_amount === "string" ? parseFloat(item.bill_amount) : item.bill_amount;
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);
  const totalAmountWallet = filteredMembers.reduce((sum, item) => {
    const amt = typeof item.balance_after === "string" ? parseFloat(item.balance_after) : item.balance_after;
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExpenses();
  }, []);



  const handleEdit = (item: ShowBill) => {
    item.requestName = "UpdateMember"; // Set requestName for edit
    setEditingItem(item);
    setEditModalVisible(true);
  };
const handleSelectMember = (selectedValue: string | null) => {
  if (!selectedValue || selectedValue === "ALL") {
    setFilteredMembers(allMembers); // Show all members
  } else {
    setFilteredMembers(allMembers.filter(m => String(m.member_id) === selectedValue));
  }
};
  const mobileRegex = /^[6-9]\d{9}$/;

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      const mobileRegex = /^[6-9]\d{9}$/; // Indian format
 if (!mobileRegex.test((editingItem.customer_mobile ?? '').toString())) 
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
    await  fetchExpenses();
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };
return (
  <>
<View style={styles.headerContainer}>
      <Text style={styles.title}>Bill Details</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-bildetails")} // Path to Add Member page
      >
        <Text style={styles.addButtonText}>+ Add Bill</Text>
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
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>B.No</Text>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Mobile</Text>
                        <Text style={styles.headerCell}>B.Amt</Text>
            <Text style={styles.headerCell}>Bal.</Text>
          </View>
        }
       
        renderItem={({ item, index }) => {
          const backgroundColor =
            item.customer_type === "wallet" ? "#d4edda" : "#f8d7da";

          return (
            <TouchableOpacity
              onPress={() => handleEdit(item)}
              style={[styles.row, { backgroundColor }]}
            >
              <Text style={styles.cell}>{formatDate(item.bill_date)}</Text>
              <Text style={styles.cell}>{item.billNo}</Text>
              <Text style={styles.cell}>{item.customer_name}</Text>
              <Text style={styles.cell}>{item.customer_mobile}</Text>
                <Text style={styles.cell}>{item.bill_amount}</Text>
               <Text style={styles.cell}>{item.balance_after}</Text>
            </TouchableOpacity>
          );
        }}
         ListFooterComponent={
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={[styles.cell]}>Total</Text>
                    <Text style={styles.cell}></Text>
                     <Text style={styles.cell}></Text>
                    <Text style={styles.cell}></Text>
                    <Text style={[styles.cell, styles.boldText]}>
                      ₹ {totalAmount.toFixed(2)}
                    </Text>
                    <Text style={styles.cell}> ₹ {totalAmountWallet.toFixed(2)}</Text>
                  </View>
                }
      />
    )}

    {/* Modal */}
    {/* <Modal visible={editModalVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Expense</Text>

          <TextInput
            style={styles.input}
            value={editingItem?.customer_mobile?.toString()}
            onChangeText={(text) =>
              setEditingItem((prev) => prev && { ...prev, name: text })
            }
          />

          <TextInput
            style={styles.input}
            value={editingItem?.customer_mobile?.toString()}
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

          <TextInput
            style={styles.input}
            value={editingItem?.customer_name?.toString()}
            onChangeText={(text) =>
              setEditingItem((prev) => prev && { ...prev, job: text })
            }
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
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
    </Modal> */}
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

boldText: {
    fontWeight: "bold",
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
totalRow: {
    flexDirection: "row",
    backgroundColor: "#d1ecf1",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 5, backgroundColor: "#fff" },
  row: { flexDirection: "row", paddingVertical: 1, borderBottomWidth: 1, borderColor: "#ddd" },
  headerRow: { backgroundColor: "#007bff" },
  headerCell: { flex: 1, fontWeight: "bold", color: "#fff", textAlign: "left", fontSize: 12 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  cell: { flex: 1, textAlign: "left", fontSize: 12, color: "#333", borderStyle: "solid", borderWidth: 0.5, borderColor: "#0e0c0cff", padding: 2 },
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
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
  payment_mode: string;
  bill_date: string;
  bill_amount: string;
  requestName: string;
  member_id: string | number;
  paymentMode: string;
  id:  number;
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
    const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' >('cash'); // Default to 'cash'
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
 

// make 

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

const handlePendingRadio = (value: string) => {

     const type = value as 'cash' | 'upi';
  setPaymentMode(type);

  if (editingItem) {
    setEditingItem({ ...editingItem, paymentMode: type });
  }
};

  const handleEdit = (item: ShowBill) => {
    item.requestName = "UpdateBill"; // Set requestName for edit

    
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
 

  const handleSave = async () => {
    alert("Saving item: " + JSON.stringify(editingItem));
    if (!editingItem) return;
if(editingItem.customer_type === "walkin" && (editingItem.payment_mode !== "pending")) {
  Alert.alert("Validation Error", "Please select a valid payment mode for walk-in customers.");
  return;
}
if(!editingItem.billNo || String(editingItem.billNo).trim() === "") {
  Alert.alert("Validation Error", "Please enter a valid bill number.");   
  return;
}
    try {
 
  console.log("Saving item:", JSON.stringify(editingItem));
    setLoading(true); // ✅ Show loader
      const response = await fetch(apiUrl+"?requestName=UpdateBill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      await response.text();
      setEditModalVisible(false);
            Alert.alert("Success", "Data updated successfully!");
        setLoading(false); // ✅ Show loader
// Refresh list
      fetchExpenses();

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
            <Text style={styles.headerCell}>Mode</Text>
          </View>
        }
       
        renderItem={({ item, index }) => {
                    const balance =item.balance_after.toString()==="#NUM!" ? "": parseFloat(item.balance_after.toString());
          const backgroundColor =
            item.customer_type === "wallet" ? "#d4edda" : "#f8d7da";
const backgroundColorCell =
            item.payment_mode === "pending" ? "#d19696ff" : backgroundColor;
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
               <Text style={styles.cell}>{balance}</Text>
               <Text style={[styles.cell, { backgroundColor: backgroundColorCell }]}>
                {item.payment_mode}
              </Text>
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
                    <Text style={styles.cell}></Text>
                  </View>
                }
                
      />
    )}

    {/* Modal */}
    <Modal visible={editingItem?.payment_mode === "pending" ?editModalVisible:false} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Expense</Text>
            <View style={styles.grid}> 
                 <View style={styles.card}>
        <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Payment</Text>
          <View style={styles.radioRow}  id="walkinOptions">
                                  {/* Wallet Member */}
                                  <TouchableOpacity
                                    style={[styles.radio, editingItem?.customer_type === "walkin" && editingItem.paymentMode=="upi" && styles.radioSelected]}
                                    onPress={() => handlePendingRadio("upi")}
                                  >
                                    <View style={[styles.circle, editingItem?.customer_type === "walkin" && editingItem.paymentMode=="upi" && styles.circleActive]} />
                                    <Text style={styles.radioLabel}>UPI</Text>
                                  </TouchableOpacity>
          
          
      
          
                                  {/* Other / Walk-in */}
                                  <TouchableOpacity
                                    style={[styles.radio, editingItem?.customer_type === "walkin" && editingItem.paymentMode=="cash" && styles.radioSelected]}
                                   onPress={() => handlePendingRadio("cash")}
                                  >
                                    <View style={[styles.circle, editingItem?.customer_type  === "walkin" && editingItem.paymentMode=="cash" && styles.circleActive]} />
                                    <Text style={styles.radioLabel}>Cash</Text>
                                  </TouchableOpacity>
                                </View>
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
      </View>
      </View>
      </View>
    </Modal> 
  </>
);


}

const styles = StyleSheet.create({


  radioRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  radio: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  radioSelected: {
    borderColor: "white", // highlight border
    backgroundColor: "#333", // optional dark bg
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 8,
  },
  circleActive: {
    backgroundColor: "white", // 👈 selected circle color
  },
  labelRadio: {
    color: "white", // label text color
  },
  headerContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
}, grid: {
    flexDirection: "column",
    gap: 8,
  }, card: {
   backgroundColor: '#111731', // equivalent of var(--card)
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.08)',
  borderRadius: 18,
  // Shadow for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.25,
  shadowRadius: 30,
  // Shadow for Android
  elevation: 5,
  },
  cardTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 12,
    marginLeft: 0,
    fontSize: 18,
    color: "#e5e9f5", // matches your --text variable
    fontWeight: "600", // optional, if you want heading style
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
  cardBody: {
    padding: 8,
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
 
  
radioLabel: {
  marginLeft: 8, // space between radio button and label
  color: "#e5e9f5", // var(--text)
},
  
 
});
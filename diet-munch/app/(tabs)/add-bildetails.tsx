
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dropdown } from "react-native-element-dropdown";
import { TextInput } from "react-native-paper";
// call api.ts to get api urls
import { apiUrls } from "../constants/api"; // adjust path as per your folder

import {
  ActivityIndicator,
  Dimensions,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { menu } from "./menu"; // adjust path as per your folder
const { width } = Dimensions.get("window");
export const Colors = {
  bg: "#0b1020",
  card: "#111731",
  muted: "#a9b1d6",
  text: "#e5e9f5",
  accent: "#6ea8fe",
  accent2: "#60d394",
  danger: "#ff6767",
  ring: "rgba(110, 168, 254, 0.25)", // used for borders/shadows
};


// const GST = 0.05;

// --- Helper Functions ---
const fmt = (n: number | string) => '₹' + (Number(n) || 0).toFixed(2);
const nowStr = () => new Date().toLocaleString();
const normalizePhone = (raw: string) => {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return '91' + digits;
  return digits;
};

// --- Interfaces ---
interface CartItem {
  id: number;
  name: string;
  qty: number;
  price: number;
}

type MemberItem = {
  sno: string | number;
  name: string;
  mobile?: string | number;
  dob: string ;
  job: string;
  location: string;
    amount: number;
  ismonthly: number;
  resuestName: string;
};


export default function TableExpenseScreen() {
  
    const router = useRouter();
  const [billNo] = useState(() => 'BILL-' + Date.now().toString().slice(-8));
  const [customerType, setCustomerType] = useState<'wallet' | 'walkin'>('wallet');
  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState(menu[0].id);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(menu[0].price);
  // const [paymentMode, setPaymentMode] = useState<'wallet' | 'cash' | 'card' | 'upi'>('wallet');
    const [paymentMode, setPaymentMode] = useState<'wallet' | 'cash' | 'upi'>('wallet');
  const [fromWallet, setFromWallet] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [cashAmt, setCashAmt] = useState(0);
  // const [cardAmt, setCardAmt] = useState(0);
    const [allMembers, setAllMembers] =useState<MemberItem[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MemberItem[]>([]);
  const [upiAmt, setUpiAmt] = useState(0);
  const [isBillLocked, setIsBillLocked] = useState(false);
const [loading, setLoading] = useState(false);
  // --- Derived State (useMemo) ---
  const { subtotal, tax, grandTotal } = useMemo(() => {
    const s = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const t =0;// +(s * GST).toFixed(2);
    const g = +(s + t).toFixed(2);
    return { subtotal: s, tax: t, grandTotal: g };
  }, [cart]);
const apiUrl=apiUrls.memberUrl; // Use the saveMember URL for saving bills
  const paidAmount = useMemo(() => {
    //return +(fromWallet + cashAmt + cardAmt + upiAmt).toFixed(2);
        return +(fromWallet + cashAmt  + upiAmt).toFixed(2);
  }, 
  // [fromWallet, cashAmt, cardAmt, upiAmt]);
  [fromWallet, cashAmt,  upiAmt]);

  const dueAmount = useMemo(() => {
    return +(grandTotal - paidAmount).toFixed(2);
  }, [grandTotal, paidAmount]);

  const remainingBalance = useMemo(() => {
    const bal = selectedMember?.amount || 0;
    return +(bal - fromWallet).toFixed(2);
  }, [selectedMember, fromWallet]);
  const fetchMembers = async () => {
    try {
      const res = await fetch(apiUrl+ "?requestName=showMembers");
      const data = await res.json();
      console.log("Fetched members:", data);
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
      fetchMembers();
    }, []);
  
  // --- Effects ---
  useEffect(() => {
    fetchMembers();
    const item = menu.find((i: { id: any; }) => i.id === selectedItemId);
    if (item) setPrice(item.price);
  }, [selectedItemId]);

  useEffect(() => {
    let newFromWallet = 0;
    let newCash = 0;
    let newCard = 0;
    let newUpi = 0;

    const total = grandTotal;
    const bal = selectedMember?.amount || 0;

    if (customerType === 'wallet') {
      newFromWallet = Math.min(bal, total);
      if (paymentMode === 'cash') newCash = total - newFromWallet;
      // if (paymentMode === 'card') newCard = total - newFromWallet;
      if (paymentMode === 'upi') newUpi = total - newFromWallet;
    } else { // walkin
      if (paymentMode === 'cash') newCash = total;
      // if (paymentMode === 'card') newCard = total;
      if (paymentMode === 'upi') newUpi = total;
    }

    setFromWallet(+newFromWallet.toFixed(2));
    setCashAmt(+newCash.toFixed(2));
    // setCardAmt(+newCard.toFixed(2));
    setUpiAmt(+newUpi.toFixed(2));
  }, [paymentMode, customerType, grandTotal, selectedMember]);


  // --- Event Handlers ---
  // const handleMemberSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //      alert('Searching for member: ' + e.target.value);
  //   const text = e.target.value.trim();
 
  //   debugger;
  //   setMemberSearch(text);
  //   const member = members.find(m =>
  //     text.includes(m.mobile) || text.toLowerCase().includes(m.name.toLowerCase())
  //   );
  //   setSelectedMember(member || null);
  //   if (member) {
  //     setCustomerName(member.name);
  //     setCustomerMobile(member.mobile);
  //   }
  // };
  const handleMemberSearch = (value: string) => {
    const memberdetails = allMembers.find(m => m.sno === parseInt(value));  
//  const text = String(value).trim(); // convert to string
  
  console.log('Searching for member:', memberdetails);
debugger;

  setMemberSearch(value);

  // const member = members.find(
  //   (m) => text.includes(m.mobile) || text.toLowerCase().includes(m.name.toLowerCase())
  // );

  setSelectedMember(memberdetails || null);

  if (memberdetails) {
    setCustomerName(memberdetails.name);
    setCustomerMobile(memberdetails.mobile?.toString() || '');
  }
};
// Instead of expecting an event, just take the value directly
const handleCustomerTypeChange = (value: string) => {

     const type = value as 'wallet' | 'walkin';
  setCustomerType(type);
    setPaymentMode(type === 'wallet' ? 'wallet' : 'cash');
    if (type === 'walkin') {
      setSelectedMember(null);
      setMemberSearch('');
      setCustomerName('');
       setCustomerMobile('');
      setFromWallet(0);
    }
};
  // const handleCustomerTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const type = e.target.value as 'wallet' | 'walkin';
  //   setCustomerType(type);
  //   setPaymentMode(type === 'wallet' ? 'wallet' : 'cash');
  //   if (type === 'walkin') {
  //     setSelectedMember(null);
  //     setMemberSearch('');
  //     setFromWallet(0);
  //   }
  // };

  // const handleAddItem = (e?: React.FormEvent) => {
  const handleAddItem = (e?: GestureResponderEvent) => {
    e?.preventDefault();
    if (!selectedItemId) return;
    const item = menu.find((i: { id: any; }) => i.id === selectedItemId);
    if (!item) return;
    setCart(prevCart => [
      ...prevCart,
      { id: item.id, name: item.name, qty, price }
    ]);
    setQty(1);
  };

  const handleUpdateCartItem = (index: number, key: keyof CartItem, value: any) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      (newCart[index] as any)[key] = Number(value);
      return newCart;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const buildWaMessage = () => {
    const name = (customerName || selectedMember?.name || 'Customer').trim();
    const mobile = (customerMobile || selectedMember?.mobile || '');
    const header = `Hello ${name},%0AYour bill from *Diet Munch*` + (billNo ? ` (Bill #${billNo})` : '') + `%0A` + nowStr();

    const items = cart.length ? cart.map(r => `• _${r.name}_ x${r.qty} = ${fmt(r.qty * r.price)}`).join('%0A') : '—';

    const parts = [];
    if (fromWallet > 0) parts.push(`Wallet ${fmt(fromWallet)}`);
    if (cashAmt > 0) parts.push(`Cash ${fmt(cashAmt)}`);
    if(remainingBalance > 0 && paymentMode==="wallet") parts.push(`Balance ${fmt(remainingBalance)}`);
    // if (cardAmt > 0) parts.push(`Card ${fmt(cardAmt)}`);
    if (upiAmt > 0) parts.push(`UPI ${fmt(upiAmt)}`);
    const payLine = parts.length ? parts.join(' + ') : '—';

    const msg = `${header}%0A%0AItems:%0A${items}Total: *${fmt(grandTotal)}*%0A%0APayment: ${payLine}%0AThanks for visiting!`;
    return { msg, mobile };
  };

  const handleConfirm = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    if (customerType === 'wallet' && !selectedMember) {
      alert('Please select a wallet member.');
      return;
    }
    if (Math.abs(dueAmount) > 0.009) {
      alert('Payment does not match total. Please adjust amounts.');
      return;
    }
 // Prepare the data to be sent to the API
    const billData = {
      bill_id: billNo,
      timestamp: new Date().toISOString(),
      customer_type: customerType,
      customer_name: customerName || selectedMember?.name || null,
      customer_mobile: customerMobile || selectedMember?.mobile || null,
      member_id: selectedMember?.sno || null,
      balance_before: selectedMember?.amount || null,
      // Calculate balance after transaction for the database
      balance_after: selectedMember ? selectedMember.amount - fromWallet : null,
      subtotal: subtotal,
      tax: tax,
      grand_total: grandTotal,
      payment_mode: paymentMode,
      amount_wallet: fromWallet,
      amount_cash: cashAmt,
      // amount_card: cardAmt,
      amount_upi: upiAmt,
      items_json: JSON.stringify(cart),
      requestName:"SaveBill"
    };
// fetch("YOUR_DEPLOYED_SCRIPT_URL", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     memberId: 101,
//     amount: 500,
//     paymentType: "Wallet"
//   })
// })
// .then(res => res.json())
// .then(data => console.log(data));
    try {
      // Send the data to your backend API
setLoading(true);
   
      console.log('Saving bill data:', billData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         body: JSON.stringify(billData),
//         body: JSON.stringify({
//     member_id: 101,
//     grand_total: 500,
// customer_type: customerType,
//      requestName:"SaveBill"
//   })
      });

    const message =  response.text(); // Get plain text from server
 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
if(response.ok) {
    alert('Bill saved successfully!');
}
      // Success: Log and then update UI
      console.log('Bill data saved successfully!');
    // Deduct wallet (mock update)
    if (selectedMember && fromWallet > 0) {
      // In a real app, this would be an API call.
      // For this example, we'll manually update the state.
      setSelectedMember(prev => prev ? { ...prev, balance: prev.amount - fromWallet } : null);
    }
    setLoading(false);
    setIsBillLocked(true);
    //window.print();
     } catch (error) {
      // Error: Alert the user and prevent printing
      console.error('Failed to save bill data:', error);
      alert('Failed to save the bill. Please check your connection and try again.');
    }
  };

const handleShareOnWhatsApp = () => {
  let { msg } = buildWaMessage();
  let phone = selectedMember?.mobile || customerMobile || '';
  if (!phone) {
    alert("No mobile number provided");
    return;
  }

  phone = normalizePhone(phone.toString());
  const encodedMsg = encodeURIComponent(msg.replace(/%0A/g, '\n'));

  const url = `whatsapp://send?phone=${phone}&text=${encodedMsg}`;

  Linking.openURL(url).catch(() => {
    alert("WhatsApp is not installed on this device");
  });
};
  // const handleShareOnWhatsApp = () => {
  //   let { msg, mobile } = buildWaMessage();
  //   let phone = "9990912056";
  //   if (!phone) {
  //     const promptPhone = window.prompt('Enter customer mobile number (with or without country code):');
  //     if (promptPhone) phone = promptPhone;
  //   }
  //   phone = normalizePhone(phone);
  //   if (!phone) {
  //     alert('No mobile number provided');
  //     return;
  //   }
  //   const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg.replace(/%0A/g, '\n'))}`;
  //   window.open(url, '_blank');
    
  // };
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
 const fontSize = clamp(width * 0.026, 20, 28); // like clamp(20px, 2.6vw, 28px)

  return (
   
     <ScrollView style={styles.root}>
    {/* <View style={styles.wrap}> */}
     <View style={styles.header}>
      <Text style={[styles.headerH1, { fontSize }]}>
        <Text style={styles.headerTitle} >Restaurant Billing</Text>
        </Text>
       <Text  style={styles.pill}>Bill #{billNo}</Text>
     </View>
     <View style={styles.grid}> 
       {/* LEFT: Items & Customer */}
        <View  style={styles.card} id="cartCard"> 
           <View style={styles.cardBody}> 
            <Text style={styles.cardTitle}>Customer</Text>
             <View style={[styles.row, { alignItems: 'flex-end' }]}>
              {/* Customer Type */}
                    <View style={[styles.field, { flexGrow: 1, flexShrink: 1, flexBasis: '100%' }]}>
                    <Text style={styles.label}>Customer Type</Text>
                        <View style={styles.radioRow}  id="customerType">
                        {/* Wallet Member */}
                        <TouchableOpacity
                          style={[styles.radio, customerType === "wallet" && styles.radioSelected]}
                          onPress={() => handleCustomerTypeChange("wallet")}
                        >
                          <View style={[styles.circle, customerType === "wallet" && styles.circleActive]} />
                          <Text style={styles.label}>Wallet Member</Text>
                        </TouchableOpacity>

                        {/* Other / Walk-in */}
                        <TouchableOpacity
                          style={[styles.radio, customerType === "walkin" && styles.radioSelected]}
                          onPress={() => handleCustomerTypeChange("walkin")}
                        >
                          <View style={[styles.circle, customerType === "walkin" && styles.circleActive]} />
                          <Text style={styles.label}>Other / Walk-in</Text>
                        </TouchableOpacity>
                      </View>
                  </View>
              {/* Member (search by name or mobile) */}
                  <View style={[styles.field, { flexGrow: 1, flexShrink: 1, flexBasis: '100%' }]} id="memberLookup">  
                      <Text style={styles.label}>Member (search by name or mobile)</Text>
                    
                     <Dropdown

style={{
                   height: 50,
                    width: "auto",
                   borderColor: "gray",
 
                   borderWidth: 1,
                   borderRadius: 8,
                   paddingHorizontal: 8,
                   marginTop: 10,
                   
                   
                 }}
                 placeholderStyle={{ fontSize: 14, color: "gray" }}
                 selectedTextStyle={{ fontSize: 14, color: "white" }}
                 inputSearchStyle={{ height: 40, fontSize: 14 }}
                 data={allMembers.map((item) => ({
                   label: `${item.sno} — ₹${item.name} (${item.mobile})`,
                   value: item.sno.toString(), // Ensure value is a string
                 }))}
                 search
                
                 labelField="label"
                 valueField="value"
                 placeholder="e.g., Rajesh or 9876543210"
              searchPlaceholder="Search member..."
                 value={memberSearch}
                 
                onChange={(item) => handleMemberSearch(item.value)} // <-- adapted for Dropdown
                 disable={isBillLocked}
  
      />
                  </View>
                  {/* Wallet Balance */}
                  <View style={[styles.field, { flexGrow: 1, flexShrink: 1, flexBasis: '100%' }]} >  
                       <Text style={styles.label}>Wallet Balance</Text>
                          <TextInput  value={fmt(selectedMember?.amount || 0)} editable={false} />
             
                    </View>
                    {/* Customer Name */}
                    <View style={[styles.field, { flexGrow: 1, flexShrink: 1, flexBasis: '100%' }]}>  
<Text style={styles.label}>Customer Name</Text>
 <TextInput
                            value={customerName}
                            onChangeText={setCustomerName}
                            editable={!isBillLocked}
                            placeholder="Customer name (optional)"
                          />
                      </View>
                       <View style={[styles.field, { flexGrow: 1, flexShrink: 1, flexBasis: '100%' }]}>  
<Text style={styles.label}>Mobile</Text>
 <TextInput
                            value={customerMobile}
                            onChangeText={setCustomerMobile}
                            editable={!isBillLocked}
                            placeholder="Optional for walk‑in"
                          />
                      </View>
               </View>
           </View>

        
        {/* Cart Items */}
        <View style={styles.card} id="cartItems">
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Cart Items</Text>
              <View style={[styles.row, { alignItems: 'flex-end'}]}> 
                
                <View style={[styles.field, { minWidth: 120, flexGrow: 1, flexShrink: 1, flexBasis: '100%' }]}>
                  <Text  style={styles.label}>Item</Text >
                   <Dropdown
                 style={{
                   height: 50,
                   width: "auto",
                   borderColor: "gray",
                   borderWidth: 1,
                   borderRadius: 8,
                   paddingHorizontal: 8,
                   marginTop: 10,
                 }}
                 placeholderStyle={{ fontSize: 14, color: "gray" }}
                 selectedTextStyle={{ fontSize: 14 , color: "white" }}
                 inputSearchStyle={{ height: 40, fontSize: 14 }}
                 data={menu.map((item: { name: any; price: any; id: any; }) => ({
                   label: `${item.name} — ₹${item.price}`,
                   value: item.id,
                 }))}
                 search
                 maxHeight={300}
                 labelField="label"
                 valueField="value"
                 placeholder="Select item"
                 searchPlaceholder="Search item..."
                 value={selectedItemId}
                 onChange={(item: { value: React.SetStateAction<number>; }) => setSelectedItemId(item.value)}
                 disable={isBillLocked}
               />
               </View>
                <View style={[styles.field, { maxWidth: 120 }]}>
                <Text  style={styles.label}>Qty</Text >
                
                  <TextInput
                          placeholder="Qty"
                          value={String(qty)}
                          onChangeText={(t) => setQty(Number(t))}
                          keyboardType="numeric"
                          editable={!isBillLocked}
                        />
              </View>
              <View style={[styles.field, { maxWidth: 120 }]}>
                <Text  style={styles.label} >Price (₹)</Text >
                
                  <TextInput
                          placeholder="Price"
                          value={String(price)}
                          onChangeText={(t) => setPrice(Number(t))}
                          keyboardType="numeric"
                          editable={!isBillLocked}
                        />
                
              </View>
        
    <Pressable 
         style={styles.btnAdd} onPress={handleAddItem} disabled={isBillLocked}>
                        <Text style={styles.text}>Add</Text>
                      </Pressable>
                      <Pressable style={styles.btnClear} onPress={() => setCart([])} disabled={isBillLocked}>
                        <Text style={styles.text}>Clear</Text>
                      </Pressable>
              </View>
     </View>
     </View>
     {/* table */}
     <View style={styles.tableDiv}>
       <View style={styles.table}>
         <View style={styles.thead}>
           <View style={styles.tr}>
             <Text style={styles.th}>Item</Text>
             <Text style={styles.th}>Qty</Text>
             <Text style={styles.th}>Price (₹)</Text>
             <Text style={styles.th}>Total (₹)</Text>
             <Text style={styles.th}>Actions</Text>
             </View>
            </View>
          <View style={styles.tbody}>
            
           
            {cart.map((item, index) => (
              <View key={index} style={styles.tr}>
                <Text style={styles.td}>{item.name}</Text>
                <Text style={styles.td}><TextInput 
                              value={String(item.qty)}
                              onChangeText={(t) => handleUpdateCartItem(index, "qty", t)}
                              editable={!isBillLocked}
                              keyboardType="numeric"
                              style={{ borderWidth: 1, width: 50 }}
                            /></Text>
                <Text style={styles.td}> 
                   <TextInput
                              value={String(item.price)}
                              onChangeText={(t) => handleUpdateCartItem(index, "price", t)}
                              editable={!isBillLocked}
                              keyboardType="numeric"
                              style={{ borderWidth: 1, width: 70 }}
                            /></Text>
                <Text style={styles.td}>{fmt(item.qty * item.price)}</Text>
                <Pressable
                  style={styles.btnRemove}
                  onPress={() => handleRemoveItem(index)}
                  disabled={isBillLocked}
                >
                  <Text style={styles.text}>X</Text>
                </Pressable>
              </View>
            ))}
 </View>
     </View>
     </View>
     {/* <View style={styles.footerBtn}>
      <View><Text style={styles.label}>Tip: PressEnter to add item</Text></View>
<View style={styles.btnRow}>
  
  <TouchableOpacity style={styles.btnAdd} >
    <Text style={styles.text}>Save Draft</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.btnClear} >
    <Text style={styles.text}>Load Draft</Text>
  </TouchableOpacity>
</View>
        </View> */}
       
        </View>

       {/* RIGHT: Totals, Payment & Share */}
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Summary</Text>
            <View style={styles.totals}>
              {/* <View style={styles.totalline}><Text style={styles.label}>Subtotal</Text><Text style={styles.label} id="subtotal">{fmt(subtotal)}</Text ></View> */}
              {/* <View style={styles.totalline}><Text style={styles.label}>GST 5%</Text><Text style={styles.label} id="tax">{fmt(tax)}</Text></View> */}
              <View style={styles.totalline}><Text style={styles.label}>Total</Text><Text style={styles.label} id="grand">{fmt(grandTotal)}</Text></View>
            </View>
          </View>
          
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Payment</Text>
            
            {customerType === 'wallet' ? (
              <View id="walletOptions">
                <View style={styles.radioRow}>
                   <TouchableOpacity
                          style={[styles.radio, customerType === "wallet" && styles.radioSelected]}
                          onPress={() => setPaymentMode("wallet")}
                        >
                          <View style={[styles.circle, customerType === "wallet" && styles.circleActive]} />
                          <Text style={styles.label}>Wallet</Text>
                        </TouchableOpacity>

                  {/* <Text  style={styles.radio}>
                    <RadioButton
    value="wallet"
    status={paymentMode === "wallet" ? "checked" : "unchecked"}
    onPress={() => setPaymentMode("wallet")}
    disabled={isBillLocked}
  />
  <Text>Wallet</Text>
                  </Text > */}
                </View>
              </View>
            ) : (
  //             <View id="walkinOptions">
  //               <View style={styles.radioRow}>
  //                 <TouchableOpacity
  //                         style={[styles.radio, customerType === "walkin" && styles.radioSelected]}
  //                         onPress={() => setPaymentMode("cash")}
  //                       >
  //                         <View style={[styles.circle, customerType === "walkin" && styles.circleActive]} />
  //                         <Text style={styles.label}>Cash</Text>
  //                       </TouchableOpacity>
  //                 {/* <Text  style={styles.radio}>
  //                  <RadioButton
  //   value="cash"
  //   status={paymentMode === "cash" ? "checked" : "unchecked"}
  //   onPress={() => setPaymentMode("cash")}
  //   disabled={isBillLocked}
  // />
  // <Text>Cash</Text>
  //                 </Text > */}
  //                 {/* <Text  style={styles.radio}>
  //                  <RadioButton
  //   value="card"
  //   status={paymentMode === "card" ? "checked" : "unchecked"}
  //   onPress={() => setPaymentMode("card")}
  //   disabled={isBillLocked}
  // />
  // <Text>Card</Text>
  //                 </Text > */}
  //                 {/* <Text  style={styles.radio}>
  //                    <RadioButton
  //   value="upi"
  //   status={paymentMode === "upi" ? "checked" : "unchecked"}
  //   onPress={() => setPaymentMode("upi")}
  //   disabled={isBillLocked}
  // />
  // <Text>UPI</Text>
  //                 </Text > */}
  //                 <TouchableOpacity
  //                         style={[styles.radio, customerType === "walkin" && styles.radioSelected]}
  //                         onPress={() => setPaymentMode("upi")}
  //                       >
  //                         <View style={[styles.circle, customerType === "walkin" && styles.circleActive]} />
  //                         <Text style={styles.label}>UPI</Text>
  //                       </TouchableOpacity>
  //               </View>
  //             </View>
   <View style={styles.radioRow}  id="walkinOptions">
                        {/* Wallet Member */}
                        <TouchableOpacity
                          style={[styles.radio, customerType === "walkin" && paymentMode=="upi" && styles.radioSelected]}
                          onPress={() => setPaymentMode("upi")}
                        >
                          <View style={[styles.circle, customerType === "walkin" && paymentMode=="upi" && styles.circleActive]} />
                          <Text style={styles.label}>UPI</Text>
                        </TouchableOpacity>

                        {/* Other / Walk-in */}
                        <TouchableOpacity
                          style={[styles.radio, customerType === "walkin" && paymentMode=="cash" && styles.radioSelected]}
                          onPress={() => setPaymentMode("cash")}
                        >
                          <View style={[styles.circle, customerType === "walkin" && paymentMode=="cash" && styles.circleActive]} />
                          <Text style={styles.label}>Cash</Text>
                        </TouchableOpacity>
                      </View>
            )}
          
            <View style={styles.totals}>
                <View  id="splitWrap" className={`split ${Math.abs(dueAmount) > 0.009 ? 'error' : ''}`}>
              {customerType === 'wallet' && (
                <View style={styles.totalline} >
                  <Text style={styles.label}>From Wallet</Text>
                 <TextInput mode="outlined"
  keyboardType="numeric"
  value={fromWallet.toString()}
  onChangeText={(text) => setFromWallet(Number(text) || 0)}
  style={{ width: 140, textAlign: "right" }}
  editable={!isBillLocked}
/>
                </View>
              )}
              {(customerType === 'walkin' && paymentMode === 'cash') && (
                <View style={styles.totalline}>
                  <Text style={styles.badge}>Cash</Text>
                  <TextInput
  mode="outlined"
  keyboardType="numeric"
  value={cashAmt.toString()}
  onChangeText={(text) => setCashAmt(Number(text) || 0)}
  style={{ width: 140, textAlign: "right" }}
  editable={!isBillLocked}
/>
                </View>
              )}
              {/* {(customerType === 'walkin' && paymentMode === 'card') && (
                <View style={styles.splitline}>
                  <Text style={styles.badge}>Card</Text>
                 
<TextInput
  mode="outlined"
  keyboardType="numeric"
  value={cardAmt.toString()}
  onChangeText={(text) => setCardAmt(Number(text) || 0)}
  style={{ width: 140, textAlign: "right" }}
  editable={!isBillLocked}
/>
                </View>
              )} */}
              {(customerType === 'walkin' && paymentMode === 'upi') && (
                <View style={styles.totalline}>
                  <Text style={styles.badge}>UPI</Text>
                 <TextInput
  mode="outlined"
  keyboardType="numeric"
  value={upiAmt.toString()}
  onChangeText={(text) => setUpiAmt(Number(text) || 0)}
  style={{ width: 140, textAlign: "right" }}
  editable={!isBillLocked}
/>
                </View>
              )}
              
            </View>
            <View style={styles.totalline}><Text  style={styles.label}>Remaining Wallet Balance</Text ><Text  style={styles.label} id="remBal">{fmt(remainingBalance)}</Text ></View>
              <View style={styles.totalline}><Text  style={styles.label}>Paid</Text ><Text  style={styles.label} id="paid">{fmt(paidAmount)}</Text ></View>
              <View style={styles.totalline}><Text  style={styles.label}>Due</Text ><Text  style={styles.label}  id="due">{fmt(dueAmount)}</Text ></View>
          </View>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>WhatsApp Share</Text>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Share Message (editable)</Text >
              <TextInput
        placeholder="Type your message here..."
        value={decodeURIComponent(buildWaMessage().msg.replaceAll('%0A', '\n'))}
        // onChangeText={setMessage}   // ✅ Editable
        multiline={true}
        editable={true} // ✅ Disable editing if bill is locked
        textAlignVertical="top"     // ✅ Keeps text starting at top
        style={styles.textArea}
      />
              </View>
            </View>
          </View>

          <View style={styles.footerBtn}>
            <View style={{ flexDirection: "row", gap: 10 }}>
  <TouchableOpacity
    onPress={() => { if (!isBillLocked) window.location.reload(); }}
    disabled={isBillLocked}
    style={[styles.btnAdd]}
  >
    <Text style={styles.btnText}>Void</Text>
  </TouchableOpacity>

  {/*  */}
 {loading ? (
              <ActivityIndicator size="large" color="#007bff" />
            ) : (
              <TouchableOpacity
    onPress={handleConfirm}
    disabled={isBillLocked}
    style={[styles.btnAdd ]}
  >
    <Text style={styles.btnText}>Confirm</Text>
  </TouchableOpacity>
            )}
  <TouchableOpacity
    onPress={handleShareOnWhatsApp}
    style={[styles.btnAdd]}
  >
    <Text style={styles.btnText}>Share on WhatsApp</Text>
  </TouchableOpacity>
</View>
            <View style={styles.field}>
              <Text style={styles.label}>Member ID:</Text>
               <Text id="memberIdLabel" style={styles.label} >{selectedMember?.sno || '—'} </Text>
               </View>
          </View>
        </View>
</View>
{/* </View> */}
      

    </ScrollView>
  );
};



const styles = StyleSheet.create({
    textArea: {
    minHeight: 100,
    maxHeight: 200,        // ✅ Stops it from getting too big
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white", // make it look like a textbox
  },
  table: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden", // makes borderRadius work on Android
    backgroundColor: "#0c1228",
  },
  thead: {
    backgroundColor: "#1a1f33",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  tbody: {
    backgroundColor: "#0c1228",
  },
  tr: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  th: {
    flex: 1,
    fontWeight: "bold",   
    color: "#e5e9f5", // matches your --text variable
    fontSize: 16,
  },
  td: {
    flex: 1,
    color: "#e5e9f5", // matches your --text variable
    fontSize: 16,
  },
  btnRemove: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#a11414ff", // matches your --error variable
    alignItems: "center",
    justifyContent: "center",
  },
  // btnAdd: {
  //   paddingVertical: 8,     
  //   paddingHorizontal: 12,
  //   borderRadius: 8,
  //   backgroundColor: "#6ea8fe", // matches your --primary variable
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  tableDiv: {
    marginTop: 12,
    overflow: "scroll", // "auto" is not valid in React Native
  },
   buttonWrapper: {
    borderRadius: 12,
    overflow: "hidden", // makes gradient respect rounded corners
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",

  },
  headerH1: {
    marginVertical: 0,
    fontWeight: "bold",
  },
  footerBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10, // Note: React Native doesn't support 'gap' for Views; you can use margin for spacing
  },
    line :{
    display: 'flex',
   justifyContent: 'space-between', 
  },
  split: {
   display : 'flex', // column direction for split items
    gap: 8, 
  },
  splitline :{
    display: 'flex',
     alignItems: 'center',   
  },
   totalline: {
    flexDirection: 'row',          // equivalent to display: flex in row direction
    justifyContent: 'space-between',
    alignItems: 'center',          // optional: aligns items vertically
    marginVertical: 4,             // optional spacing between lines
  },
  h2: {
    fontSize: 24, // 1.5em ≈ 24px (adjust as needed)
    fontWeight: 'bold',
    marginVertical: 12, // roughly equivalent to 0.83em top and bottom
    marginHorizontal: 0, // no horizontal margin
    color: '#e5e9f5', // matches your --text variable
  }, cardH2: {
    marginBottom: 12, // corresponds to '0 0 12px'
    fontSize: 18,
    fontWeight: 'bold', // optional, depending on desired style
    color: '#e5e9f5', // matches your --text variable
  },
  totalLineText: {
    fontWeight: 'bold',
    fontSize: 20,
  }, badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    fontSize: 12,
    color: '#e5e9f5', // assuming var(--text) for text color
    overflow: 'hidden', // ensures borderRadius works on Android
  },
   root: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 5, // Android shadow
  },
  title: {
    color: Colors.text,
    fontSize: 18,
  },
    dropdown: {
    height: 48,
    borderColor: '#a11414ff',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#0c0101ff',
    color: '#e5e9f5', // matches your --text variable
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    borderRadius: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
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
  radioSelected: {
    borderColor: "#6ea8fe",
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#aaa",
    marginRight: 8,
  },
  circleActive: {
    borderColor: "#6ea8fe",
    backgroundColor: "#6ea8fe",
  },
  radio: {
  flexDirection: "row",
  alignItems: "center",
color: "#e5e9f5", // var(--text)
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.1)",
  backgroundColor: "#0c1228",
  borderRadius: 12,
  marginRight: 8, // simulates gap
},
radioLabel: {
  marginLeft: 8, // space between radio button and label
  color: "#e5e9f5", // var(--text)
},
  
  radioRow: {
    flexDirection: "row",   // display:flex → row
    gap: 2,                 // React Native supports gap in newer versions
    alignItems: "center",
    flexWrap: "wrap",
  },
  label: {
    fontSize: 12,
    color: "#a9b1d6", // your --muted variable
  },
  wrap: {
    maxWidth: 1100,
    marginHorizontal: "auto", // won't work directly → use flex layout
    padding: 20,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10, // requires RN 0.71+, else use marginRight
    flexWrap: 'wrap',
  },
  btnClear: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
 
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAdd: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#1143ccff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#e5e9f5',
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  
  },
  // headerTitle: {
  //   fontSize: 28, // React Native doesn't support clamp()
  //   margin: 0,
  //   color: "#e5e9f5",
  // },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(110, 168, 254, 0.15)",
    color: "#6ea8fe",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: Math.min(Math.max(20, width * 0.026), 28), 
    margin: 0,
    color: "#e5e9f5",
  },
  grid: {
    flexDirection: "column",
    gap: 8,
  },
  card: {
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
   body: {
    flex: 1,
    margin: 0,
    // fontFamily: 'Inter', // ensure the font is linked in your project
    color: '#e5e9f5', // var(--text)
  },
  cardBody: {
    padding: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  field: {
    flexDirection: "column",
    gap: 6,
    minWidth: 120,
    flex: 1,
  },
    input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#0c1228',
    color: '#e5e9f5', // var(--text)
  },
  textarea: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#0c1228',
    color: '#e5e9f5',
    minHeight: 96,
    textAlignVertical: 'top', // for multiline
  },
  inputFocused: {
    borderColor: 'rgba(110, 168, 254, 0.6)',
    // For shadow, React Native uses shadow props on iOS, elevation on Android
    shadowColor: 'rgba(110,168,254,0.25)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  
  // radio: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 8,
  //   paddingVertical: 8,
  //   paddingHorizontal: 12,
  //   borderWidth: 1,
  //   borderColor: "rgba(255,255,255,0.1)",
  //   backgroundColor: "#0c1228",
  //   borderRadius: 12,
  // },

  btnPrimary: {
    backgroundColor: "#356dff",
  },
  btnDanger: {
    backgroundColor: "#301517",
    borderColor: "rgba(255,0,0,0.3)",
  },
  totals: {
    gap: 8,
  },
  totalsLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalsLineTotal: {
    fontWeight: "800",
    fontSize: 20,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  hint: {
    fontSize: 12,
    color: "#a9b1d6",
  },
  error: {
    borderWidth: 1,
    borderColor: "#ff6767",
  },
});


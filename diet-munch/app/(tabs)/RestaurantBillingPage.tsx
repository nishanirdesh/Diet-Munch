import React, { useEffect, useMemo, useState } from 'react';
import './styles.css'; // Import the CSS file
import { Dropdown } from 'react-native-element-dropdown';
import { TextInput } from "react-native-paper";
import { View, Text,  Pressable, GestureResponderEvent, FlatList } from 'react-native';
import { RadioButton } from "react-native-paper";
// --- Mock Data (replace with API calls / DB) ---
const MEMBERS = [
  { id: 101, name: 'Naresh Kumar', mobile: '8750503366', balance: 500 },
  { id: 102, name: 'Vipin Bhati', mobile: '8860060063', balance: 1200.5 },
  { id: 103, name: 'Ankit', mobile: '9990993328', balance: 50 },
];

const MENU = [
  { id: 1, name: 'Grilled Chicken Wrap', price: 140, category: 'Non-Veg Wrap' },
  { id: 2, name: 'Roasted Chicken Breast Wrap', price: 140, category: 'Non-Veg Wrap' },
  { id: 3, name: 'Chicken Tikka Wrap', price: 150, category: 'Non-Veg Wrap' },
  { id: 4, name: 'Chicken Kabab Wrap', price: 150, category: 'Non-Veg Wrap' },
  { id: 5, name: 'Chicken Makhani Wrap', price: 150, category: 'Non-Veg Wrap' },
  { id: 6, name: 'Chicken Cheese Wrap', price: 160, category: 'Non-Veg Wrap' },
  { id: 7, name: 'Chicken Shawarma Wrap', price: 180, category: 'Non-Veg Wrap' },
  { id: 8, name: 'Potato Herbs Wrap', price: 100, category: 'Veg Wrap' },
  { id: 9, name: 'Grilled Tofu Wrap', price: 110, category: 'Veg Wrap' },
  { id: 10, name: 'Grilled Paneer Wrap', price: 120, category: 'Veg Wrap' },
  { id: 11, name: 'Paneer Tikka Wrap', price: 140, category: 'Veg Wrap' },
  { id: 12, name: 'Paneer Makhani Wrap', price: 150, category: 'Veg Wrap' },
  { id: 13, name: 'Soya Chikki Wrap', price: 140, category: 'Veg Wrap' },
  { id: 14, name: 'Veg Shami Kabab Wrap', price: 140, category: 'Veg Wrap' },
  { id: 15, name: 'Onion Tomato Poha', price: 80, category: 'Poha' },
  { id: 16, name: 'English Veggie Poha', price: 100, category: 'Poha' },
  { id: 17, name: 'Tofu Poha', price: 110, category: 'Poha' },
  { id: 18, name: 'Paneer Poha', price: 120, category: 'Poha' },
  { id: 19, name: 'Paneer Bhurji Poha', price: 120, category: 'Poha' },
  { id: 20, name: 'Egg Bhurji Poha', price: 130, category: 'Poha' },
  { id: 21, name: 'Grill Chicken Poha', price: 130, category: 'Poha' },
  { id: 22, name: 'Chicken Keema Poha', price: 130, category: 'Poha' },
  { id: 23, name: 'Boiled Eggs (5 pcs)', price: 60, category: 'Egg Dish' },
  { id: 24, name: 'Masala Omelette', price: 80, category: 'Egg Dish' },
  { id: 25, name: 'Half-fry Omelette', price: 100, category: 'Egg Dish' },
  { id: 26, name: 'English Veggies Omelette', price: 110, category: 'Egg Dish' },
  { id: 27, name: 'Cheese Omelette', price: 120, category: 'Egg Dish' },
  { id: 28, name: 'English Veggies Cheese Omelette', price: 150, category: 'Egg Dish' },
  { id: 29, name: 'Chicken Omelette', price: 130, category: 'Egg Dish' },
  { id: 30, name: 'Chicken Cheese Omelette', price: 180, category: 'Egg Dish' },
  { id: 31, name: 'Chicken Keema Omelette', price: 180, category: 'Egg Dish' },
  { id: 32, name: 'White Sauce Pasta', price: 150, category: 'Pasta' },
  { id: 33, name: 'Red Sauce Pasta', price: 150, category: 'Pasta' },
  { id: 34, name: 'Mix Sauce Pasta', price: 150, category: 'Pasta' },
  { id: 35, name: 'Pesto Pasta', price: 150, category: 'Pasta' },
  { id: 36, name: 'Steam Egg White Salad', price: 150, category: 'Non-Veg Salad' },
  { id: 37, name: 'Steam Chicken Salad', price: 170, category: 'Non-Veg Salad' },
  { id: 38, name: 'Grill Chicken Salad', price: 180, category: 'Non-Veg Salad' },
  { id: 39, name: 'Chicken Kabab Salad', price: 190, category: 'Non-Veg Salad' },
  { id: 40, name: 'Chicken Tikka Salad', price: 190, category: 'Non-Veg Salad' },
  { id: 41, name: 'High Protein Non-Veg Salad', price: 220, category: 'Non-Veg Salad' },
  { id: 42, name: 'Chicken Shawarma Salad', price: 190, category: 'Non-Veg Salad' },
  { id: 43, name: 'Roasted Chicken Breast Salad', price: 190, category: 'Non-Veg Salad' },
  { id: 44, name: 'Mix Sprout Salad', price: 130, category: 'Veg Salad' },
  { id: 45, name: 'Green Garden Salad', price: 150, category: 'Veg Salad' },
  { id: 46, name: 'Grill Tofu Salad', price: 150, category: 'Veg Salad' },
  { id: 47, name: 'Roasted Tofu Salad', price: 170, category: 'Veg Salad' },
  { id: 48, name: 'Grill Paneer Salad', price: 170, category: 'Veg Salad' },
  { id: 49, name: 'Beans Salad', price: 180, category: 'Veg Salad' },
  { id: 50, name: 'Paneer Tikka Salad', price: 180, category: 'Veg Salad' },
  { id: 51, name: 'Soya Chikki Salad', price: 190, category: 'Veg Salad' },

  { id: 52, name: 'Steam Egg White Sub', price: 140, category: 'Non-Veg Sub' },
  { id: 53, name: 'Grilled Chicken Sub', price: 150, category: 'Non-Veg Sub' },
  { id: 54, name: 'Chicken Kabab Sub', price: 170, category: 'Non-Veg Sub' },
  { id: 55, name: 'Chicken Tikka Sub', price: 170, category: 'Non-Veg Sub' },
  { id: 56, name: 'Grilled Chicken Cheese Sub', price: 180, category: 'Non-Veg Sub' },
  { id: 57, name: 'Egg Chicken Sub', price: 180, category: 'Non-Veg Sub' },
  { id: 58, name: 'Chicken Makhani Sub', price: 180, category: 'Non-Veg Sub' },
  { id: 59, name: 'Chicken Shawarma Sub', price: 180, category: 'Non-Veg Sub' },
  { id: 60, name: 'English Veggie Sub', price: 130, category: 'Veg Sub' },
  { id: 61, name: 'Grill Tofu Sub', price: 140, category: 'Veg Sub' },
  { id: 62, name: 'Grill Paneer Sub', price: 150, category: 'Veg Sub' },
  { id: 63, name: 'Roasted Tofu Sub', price: 160, category: 'Veg Sub' },
  { id: 64, name: 'Paneer Tikka Sub', price: 170, category: 'Veg Sub' },
  { id: 65, name: 'Paneer Makhani Sub', price: 170, category: 'Veg Sub' },
  { id: 66, name: 'Pesto Paneer Sub', price: 170, category: 'Veg Sub' },
  { id: 67, name: 'Cheese Potato Herbs Sub', price: 170, category: 'Veg Sub' },
  { id: 68, name: 'Veg Shami Kabab Sub', price: 170, category: 'Veg Sub' },
  { id: 69, name: 'Soya Chikki Sub', price: 170, category: 'Veg Sub' },
  { id: 70, name: 'Steam Egg White Rice Bowl', price: 150, category: 'Non-Veg Rice Bowl' },
  { id: 71, name: 'Egg Bhurji Rice Bowl', price: 150, category: 'Non-Veg Rice Bowl' },
  { id: 72, name: 'Steam Chicken Rice Bowl', price: 170, category: 'Non-Veg Rice Bowl' },
  { id: 73, name: 'Grilled Chicken Rice Bowl', price: 180, category: 'Non-Veg Rice Bowl' },
  { id: 74, name: 'Chicken Kabab Rice Bowl', price: 190, category: 'Non-Veg Rice Bowl' },
  { id: 75, name: 'Roasted Chicken Breast Rice Bowl', price: 180, category: 'Non-Veg Rice Bowl' },
  { id: 76, name: 'Chicken Tikka Rice Bowl', price: 190, category: 'Non-Veg Rice Bowl' },
  { id: 77, name: 'Egg Chicken Rice Bowl', price: 190, category: 'Non-Veg Rice Bowl' },
  { id: 78, name: 'Chicken Shawarma Rice Bowl', price: 190, category: 'Non-Veg Rice Bowl' },
  { id: 79, name: 'English Veggies Rice Bowl', price: 130, category: 'Veg Rice Bowl' },
  { id: 80, name: 'Grilled Tofu Rice Bowl', price: 140, category: 'Veg Rice Bowl' },
  { id: 81, name: 'Roasted Tofu Rice Bowl', price: 150, category: 'Veg Rice Bowl' },
  { id: 82, name: 'Grilled Paneer Rice Bowl', price: 160, category: 'Veg Rice Bowl' },
  { id: 83, name: 'Paneer Tikka Rice Bowl', price: 170, category: 'Veg Rice Bowl' },
  { id: 84, name: 'Paneer Bhurji Rice Bowl', price: 160, category: 'Veg Rice Bowl' },
  { id: 85, name: 'Beans Rice Bowl', price: 160, category: 'Veg Rice Bowl' },
  { id: 86, name: 'Soya Chikki Rice Bowl', price: 190, category: 'Veg Rice Bowl' },
  { id: 87, name: 'Soya Kabab Rice Bowl', price: 190, category: 'Veg Rice Bowl' },


];

const GST = 0.05;

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

interface Member {
  id: number;
  name: string;
  mobile: string;
  balance: number;
}

// --- Main Component ---
const RestaurantBillingPage: React.FC = () => {
  const [billNo] = useState(() => 'BILL-' + Date.now().toString().slice(-8));
  const [customerType, setCustomerType] = useState<'wallet' | 'walkin'>('wallet');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState(MENU[0].id);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(MENU[0].price);
  const [paymentMode, setPaymentMode] = useState<'wallet' | 'cash' | 'card' | 'upi'>('wallet');
  const [fromWallet, setFromWallet] = useState(0);
  const [cashAmt, setCashAmt] = useState(0);
  const [cardAmt, setCardAmt] = useState(0);
  const [upiAmt, setUpiAmt] = useState(0);
  const [isBillLocked, setIsBillLocked] = useState(false);
// New

  // --- Derived State (useMemo) ---
  const { subtotal, tax, grandTotal } = useMemo(() => {
    const s = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const t = +(s * GST).toFixed(2);
    const g = +(s + t).toFixed(2);
    return { subtotal: s, tax: t, grandTotal: g };
  }, [cart]);

  const paidAmount = useMemo(() => {
    return +(fromWallet + cashAmt + cardAmt + upiAmt).toFixed(2);
  }, [fromWallet, cashAmt, cardAmt, upiAmt]);

  const dueAmount = useMemo(() => {
    return +(grandTotal - paidAmount).toFixed(2);
  }, [grandTotal, paidAmount]);

  const remainingBalance = useMemo(() => {
    const bal = selectedMember?.balance || 0;
    return +(bal - fromWallet).toFixed(2);
  }, [selectedMember, fromWallet]);

  // --- Effects ---
  useEffect(() => {
    const item = MENU.find(i => i.id === selectedItemId);
    if (item) setPrice(item.price);
  }, [selectedItemId]);

  useEffect(() => {
    let newFromWallet = 0;
    let newCash = 0;
    let newCard = 0;
    let newUpi = 0;

    const total = grandTotal;
    const bal = selectedMember?.balance || 0;

    if (customerType === 'wallet') {
      newFromWallet = Math.min(bal, total);
      if (paymentMode === 'cash') newCash = total - newFromWallet;
      if (paymentMode === 'card') newCard = total - newFromWallet;
      if (paymentMode === 'upi') newUpi = total - newFromWallet;
    } else { // walkin
      if (paymentMode === 'cash') newCash = total;
      if (paymentMode === 'card') newCard = total;
      if (paymentMode === 'upi') newUpi = total;
    }

    setFromWallet(+newFromWallet.toFixed(2));
    setCashAmt(+newCash.toFixed(2));
    setCardAmt(+newCard.toFixed(2));
    setUpiAmt(+newUpi.toFixed(2));
  }, [paymentMode, customerType, grandTotal, selectedMember]);

  // --- Event Handlers ---
  const handleMemberSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim();
    setMemberSearch(text);
    const member = MEMBERS.find(m =>
      text.includes(m.mobile) || text.toLowerCase().includes(m.name.toLowerCase())
    );
    setSelectedMember(member || null);
    if (member) {
      setCustomerName(member.name);
      setCustomerMobile(member.mobile);
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
  //   e?.preventDefault();
  //   if (!selectedItemId) return;
  //   const item = MENU.find(i => i.id === selectedItemId);
  //   if (!item) return;
  //   setCart(prevCart => [
  //     ...prevCart,
  //     { id: item.id, name: item.name, qty, price }
  //   ]);
  //   setQty(1);
  // };
 const handleAddItem = (e?: GestureResponderEvent) => {
    e?.preventDefault();
    if (!selectedItemId) return;
    const item = MENU.find(i => i.id === selectedItemId);
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
    const mobile = (customerMobile || selectedMember?.mobile || '').trim();
    const header = `Hello ${name},%0AYour bill from *My Restaurant*` + (billNo ? ` (Bill #${billNo})` : '') + `%0A` + nowStr();

    const items = cart.length ? cart.map(r => `• _${r.name}_ x${r.qty} = ${fmt(r.qty * r.price)}`).join('%0A') : '—';

    const parts = [];
    if (fromWallet > 0) parts.push(`Wallet ${fmt(fromWallet)}`);
    if (cashAmt > 0) parts.push(`Cash ${fmt(cashAmt)}`);
    if (cardAmt > 0) parts.push(`Card ${fmt(cardAmt)}`);
    if (upiAmt > 0) parts.push(`UPI ${fmt(upiAmt)}`);
    const payLine = parts.length ? parts.join(' + ') : '—';

    const msg = `${header}%0A%0AItems:%0A${items}%0A%0ASubtotal: ${fmt(subtotal)}%0AGST: ${fmt(tax)}%0ATotal: *${fmt(grandTotal)}*%0A%0APayment: ${payLine}%0AThanks for visiting!`;
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
      member_id: selectedMember?.id || null,
      balance_before: selectedMember?.balance || null,
      // Calculate balance after transaction for the database
      balance_after: selectedMember ? selectedMember.balance - fromWallet : null,
      subtotal: subtotal,
      tax: tax,
      grand_total: grandTotal,
      payment_mode: paymentMode,
      amount_wallet: fromWallet,
      amount_cash: cashAmt,
      amount_card: cardAmt,
      amount_upi: upiAmt,
      items_json: JSON.stringify(cart),
    };

    try {
      // Send the data to your backend API
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Success: Log and then update UI
      console.log('Bill data saved successfully!');
    // Deduct wallet (mock update)
    if (selectedMember && fromWallet > 0) {
      // In a real app, this would be an API call.
      // For this example, we'll manually update the state.
      setSelectedMember(prev => prev ? { ...prev, balance: prev.balance - fromWallet } : null);
    }
    setIsBillLocked(true);
    //window.print();
     } catch (error) {
      // Error: Alert the user and prevent printing
      console.error('Failed to save bill data:', error);
      alert('Failed to save the bill. Please check your connection and try again.');
    }
  };


  const handleShareOnWhatsApp = () => {
    let { msg, mobile } = buildWaMessage();
    let phone = mobile;
    if (!phone) {
      const promptPhone = window.prompt('Enter customer mobile number (with or without country code):');
      if (promptPhone) phone = promptPhone;
    }
    phone = normalizePhone(phone);
    if (!phone) {
      alert('No mobile number provided');
      return;
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg.replace(/%0A/g, '\n'))}`;
    window.open(url, '_blank');
  };

  // --- JSX Rendering ---
  return (
    <View className="wrap">
      <View className="header">
        <Text>Restaurant Billing</Text>
    <Text  className="pill">Bill #{billNo}</Text>
      </View>

      <View className="grid">
        {/* LEFT: Items & Customer */}
        <View  className="card" id="cartCard">
          <View className="body">
            <Text>Customer</Text>
            <View className="row" style={{ alignItems: 'flex-end' }}>
              
<View className="field">
  <Text >Customer Type</Text>
  <RadioButton.Group
    onValueChange={handleCustomerTypeChange}
    value={customerType}
  >
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
      <RadioButton value="wallet" disabled={isBillLocked} />
      <Text>Wallet Member</Text>
    </View>

    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <RadioButton value="walkin" disabled={isBillLocked} />
      <Text>Other / Walk-in</Text>
    </View>
  </RadioButton.Group>
</View>
              <View className={`field ${customerType === 'walkin' ? 'hidden' : ''}`} id="memberLookup">
                <Text>Member (search by name or mobile)</Text>
              <View>
            <Text>Member Search</Text>
                 <Dropdown
        // style={styles.dropdown}
        // placeholderStyle={styles.placeholderStyle}
        // selectedTextStyle={styles.selectedTextStyle}
        // inputSearchStyle={styles.inputSearchStyle}
        data={MEMBERS}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="e.g., Rajesh or 9876543210"
        searchPlaceholder="Search member..."
        value={memberSearch}
        onChange={(item: { value: React.SetStateAction<string>; }) => {
          setMemberSearch(item.value);
        }}
        disable={isBillLocked}
      />
            
          </View>
              </View>

              <View className="field">
                <Text>Wallet Balance</Text>
                {/* <input id="walletBalance" value={fmt(selectedMember?.balance || 0)} disabled />
                 */}
                 <TextInput value={fmt(selectedMember?.balance || 0)} editable={false} />
              </View>

              <View className="field">
                <Text>Customer Name</Text>
                {/* <input id="customerName" placeholder="Customer name (optional)" value={customerName} onChange={e => setCustomerName(e.target.value)} disabled={isBillLocked} /> */}
                 <TextInput
                            value={customerName}
                            onChangeText={setCustomerName}
                            editable={!isBillLocked}
                            placeholder="Customer name (optional)"
                          />
              </View>

              <View className="field">
                <Text >Mobile</Text >
                {/* <input id="customerMobile" placeholder="Optional for walk‑in" value={customerMobile} onChange={e => setCustomerMobile(e.target.value)} disabled={isBillLocked} /> */}
                  <TextInput
                            value={customerMobile}
                            onChangeText={setCustomerMobile}
                            editable={!isBillLocked}
                            placeholder="Optional for walk-in"
                          />
              </View>
            </View>
          </View>

          <View className="body">
            <Text>Items</Text>
            {/* <form className="row" style={{ alignItems: 'flex-end' }} onSubmit={handleAddItem}> */}
              <View className="field">
                <Text >Item</Text >
               <Dropdown
                 style={{
                   height: 50,
                   borderColor: "gray",
                   borderWidth: 1,
                   borderRadius: 8,
                   paddingHorizontal: 8,
                   marginTop: 10,
                 }}
                 placeholderStyle={{ fontSize: 14, color: "gray" }}
                 selectedTextStyle={{ fontSize: 14 }}
                 inputSearchStyle={{ height: 40, fontSize: 14 }}
                 data={MENU.map((item) => ({
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
              <View className="field" style={{ maxWidth: 120 }}>
                <Text >Qty</Text >
                {/* <input type="number" id="qty" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} disabled={isBillLocked} /> */}
                  <TextInput
                          placeholder="Qty"
                          value={String(qty)}
                          onChangeText={(t) => setQty(Number(t))}
                          keyboardType="numeric"
                          editable={!isBillLocked}
                        />
              </View>
              <View className="field" style={{ maxWidth: 160 }}>
                <Text >Price (₹)</Text >
                {/* <input type="number" id="price" min="0" step="0.01" value={price} onChange={e => setPrice(Number(e.target.value))} disabled={isBillLocked} /> */}
                  <TextInput
                          placeholder="Price"
                          value={String(price)}
                          onChangeText={(t) => setPrice(Number(t))}
                          keyboardType="numeric"
                          editable={!isBillLocked}
                        />
                
              </View>
                <Pressable className="btn primary" onPress={handleAddItem} disabled={isBillLocked}>
                        <Text>Add</Text>
                      </Pressable>
                      <Pressable className="btn ghost" onPress={() => setCart([])} disabled={isBillLocked}>
                        <Text>Clear</Text>
                      </Pressable>
              {/* <button type="submit" className="btn primary" id="addBtn" title="Add item (Enter)" disabled={isBillLocked}>Add</button>
              <button type="button" className="btn ghost" id="clearBtn" title="Clear items" onClick={() => setCart([])} disabled={isBillLocked}>Clear</button>
            </form> */}
 {/* <View style={{ marginTop: 12, overflow: 'auto' }}></View> */}
            <View >
              {/* <table id="cartTable">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td><input className="qty" type="number" min="1" value={item.qty} onChange={e => handleUpdateCartItem(index, 'qty', e.target.value)} disabled={isBillLocked} /></td>
                      <td><input className="price" type="number" min="0" step="0.01" value={item.price} onChange={e => handleUpdateCartItem(index, 'price', e.target.value)} disabled={isBillLocked} /></td>
                      <td className="lineTotal">{fmt(item.qty * item.price)}</td>
                      <td><button className="btn danger" title="Remove" onClick={() => handleRemoveItem(index)} disabled={isBillLocked}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
               {/* Cart List */}
                      <FlatList
                        data={cart}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item, index }) => (
                          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>{item.name}</Text>
                            <TextInput
                              value={String(item.qty)}
                              onChangeText={(t) => handleUpdateCartItem(index, "qty", t)}
                              editable={!isBillLocked}
                              keyboardType="numeric"
                              style={{ borderWidth: 1, width: 50 }}
                            />
                            <TextInput
                              value={String(item.price)}
                              onChangeText={(t) => handleUpdateCartItem(index, "price", t)}
                              editable={!isBillLocked}
                              keyboardType="numeric"
                              style={{ borderWidth: 1, width: 70 }}
                            />
                            <Text>{fmt(item.qty * item.price)}</Text>
                            <Pressable onPress={() => handleRemoveItem(index)}>
                              <Text>✕</Text>
                            </Pressable>
                          </View>
                        )}
                      />
            </View>
          </View>
        </View>

        {/* RIGHT: Totals, Payment & Share */}
        <View className="card">
          <View className="body">
            <Text>Summary</Text>
            <View className="totals">
              <View className="line"><Text >Subtotal</Text><Text id="subtotal">{fmt(subtotal)}</Text ></View>
              <View className="line"><Text >GST 5%</Text><Text id="tax">{fmt(tax)}</Text></View>
              <View className="line total"><Text >Total</Text><Text id="grand">{fmt(grandTotal)}</Text></View>
            </View>
          </View>
          <View className="body">
            <Text>Payment</Text>
            {customerType === 'wallet' ? (
              <View id="walletOptions">
                <View className="row">
                  <Text  className="radio">
                    <RadioButton
    value="wallet"
    status={paymentMode === "wallet" ? "checked" : "unchecked"}
    onPress={() => setPaymentMode("wallet")}
    disabled={isBillLocked}
  />
  <Text>Wallet</Text>
                  </Text >
                </View>
              </View>
            ) : (
              <View id="walkinOptions">
                <View className="row">
                  <Text  className="radio">
                   <RadioButton
    value="cash"
    status={paymentMode === "cash" ? "checked" : "unchecked"}
    onPress={() => setPaymentMode("cash")}
    disabled={isBillLocked}
  />
  <Text>Cash</Text>
                  </Text >
                  <Text  className="radio">
                   <RadioButton
    value="card"
    status={paymentMode === "card" ? "checked" : "unchecked"}
    onPress={() => setPaymentMode("card")}
    disabled={isBillLocked}
  />
  <Text>Card</Text>
                  </Text >
                  <Text  className="radio">
                     <RadioButton
    value="upi"
    status={paymentMode === "upi" ? "checked" : "unchecked"}
    onPress={() => setPaymentMode("upi")}
    disabled={isBillLocked}
  />
  <Text>UPI</Text>
                  </Text >
                </View>
              </View>
            )}
            <View className={`split ${Math.abs(dueAmount) > 0.009 ? 'error' : ''}`}>
              {customerType === 'wallet' && (
                <View className="line">
                  <Text className="badge">From Wallet</Text>
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
                <View className="line">
                  <Text className="badge">Cash</Text>
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
              {(customerType === 'walkin' && paymentMode === 'card') && (
                <View className="line">
                  <Text className="badge">Card</Text>
                 // Inside your component
<TextInput
  mode="outlined"
  keyboardType="numeric"
  value={cardAmt.toString()}
  onChangeText={(text) => setCardAmt(Number(text) || 0)}
  style={{ width: 140, textAlign: "right" }}
  editable={!isBillLocked}
/>
                </View>
              )}
              {(customerType === 'walkin' && paymentMode === 'upi') && (
                <View className="line">
                  <Text className="badge">UPI</Text>
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
              <View className="line"><Text  className="muted">Remaining Wallet Balance</Text ><Text  id="remBal">{fmt(remainingBalance)}</Text ></View>
              <View className="line"><Text  className="muted">Paid</Text ><Text  id="paid">{fmt(paidAmount)}</Text ></View>
              <View className="line"><Text  className="muted">Due</Text ><Text  id="due">{fmt(dueAmount)}</Text ></View>
            </View>
          </View>

          <View className="body">
            <Text>WhatsApp Share</Text>
            <View className="row">
              <View className="field">
                <Text >Share Message (editable)</Text >
               <TextInput
  mode="outlined"
  placeholder="Message preview will appear here..."
  value={decodeURIComponent(buildWaMessage().msg.replaceAll('%0A', '\n'))}
  multiline
  numberOfLines={4}
  editable={false} // same as readOnly
  style={{ minHeight: 100 }}
/>
              </View>
            </View>
          </View>

          <View className="footer">
            <View className="btn-row">
              {/* <button className="btn danger" id="voidBtn" onClick={() => window.location.reload()} disabled={isBillLocked}>Void</button>
              <button className="btn primary" id="confirmBtn" onClick={handleConfirm} disabled={isBillLocked}>Confirm</button>
              <button className="btn" id="whatsappBtn" onClick={handleShareOnWhatsApp}>Share on WhatsApp</button> */}
            </View>
            <View className="hint">Member ID: <Text id="memberIdLabel" className="badge">{selectedMember?.id || '—'}</Text></View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RestaurantBillingPage;
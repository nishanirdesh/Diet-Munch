import React, { useEffect, useMemo, useState } from 'react';
import './styles.css'; // Import the CSS file

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

  const handleCustomerTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value as 'wallet' | 'walkin';
    setCustomerType(type);
    setPaymentMode(type === 'wallet' ? 'wallet' : 'cash');
    if (type === 'walkin') {
      setSelectedMember(null);
      setMemberSearch('');
      setFromWallet(0);
    }
  };

  const handleAddItem = (e?: React.FormEvent) => {
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
    <div className="wrap">
      <header>
        <h1>Restaurant Billing</h1>
        <div className="pill">Bill #{billNo}</div>
      </header>

      <div className="grid">
        {/* LEFT: Items & Customer */}
        <section className="card" id="cartCard">
          <div className="body">
            <h2>Customer</h2>
            <div className="row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: '1 1 100%' }}>
                <label>Customer Type</label>
                <div className="radio-row">
                  <label className="radio">
                    <input type="radio" name="ctype" value="wallet" checked={customerType === 'wallet'} onChange={handleCustomerTypeChange} disabled={isBillLocked} /> Wallet Member
                  </label>
                  <label className="radio">
                    <input type="radio" name="ctype" value="walkin" checked={customerType === 'walkin'} onChange={handleCustomerTypeChange} disabled={isBillLocked} /> Other / Walk‑in
                  </label>
                </div>
              </div>

              <div className={`field ${customerType === 'walkin' ? 'hidden' : ''}`} id="memberLookup">
                <label>Member (search by name or mobile)</label>
                <input id="memberSearch" placeholder="e.g., Rajesh or 9876543210" list="memberList" value={memberSearch} onChange={handleMemberSearch} disabled={isBillLocked} />
                <datalist id="memberList">
                  {MEMBERS.map(m => <option key={m.id} value={`${m.name} (${m.mobile})`} />)}
                </datalist>
              </div>

              <div className="field">
                <label>Wallet Balance</label>
                <input id="walletBalance" value={fmt(selectedMember?.balance || 0)} disabled />
              </div>

              <div className="field">
                <label>Customer Name</label>
                <input id="customerName" placeholder="Customer name (optional)" value={customerName} onChange={e => setCustomerName(e.target.value)} disabled={isBillLocked} />
              </div>

              <div className="field">
                <label>Mobile</label>
                <input id="customerMobile" placeholder="Optional for walk‑in" value={customerMobile} onChange={e => setCustomerMobile(e.target.value)} disabled={isBillLocked} />
              </div>
            </div>
          </div>

          <div className="body">
            <h2>Items</h2>
            <form className="row" style={{ alignItems: 'flex-end' }} onSubmit={handleAddItem}>
              <div className="field">
                <label>Item</label>
                <select id="itemSelect" value={selectedItemId} onChange={e => setSelectedItemId(Number(e.target.value))} disabled={isBillLocked}>
                  {MENU.map(item => (
                    <option key={item.id} value={item.id}>{item.name} — ₹{item.price}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ maxWidth: 120 }}>
                <label>Qty</label>
                <input type="number" id="qty" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} disabled={isBillLocked} />
              </div>
              <div className="field" style={{ maxWidth: 160 }}>
                <label>Price (₹)</label>
                <input type="number" id="price" min="0" step="0.01" value={price} onChange={e => setPrice(Number(e.target.value))} disabled={isBillLocked} />
              </div>
              <button type="submit" className="btn primary" id="addBtn" title="Add item (Enter)" disabled={isBillLocked}>Add</button>
              <button type="button" className="btn ghost" id="clearBtn" title="Clear items" onClick={() => setCart([])} disabled={isBillLocked}>Clear</button>
            </form>

            <div style={{ marginTop: 12, overflow: 'auto' }}>
              <table id="cartTable">
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
              </table>
            </div>
          </div>
        </section>

        {/* RIGHT: Totals, Payment & Share */}
        <aside className="card">
          <div className="body">
            <h2>Summary</h2>
            <div className="totals">
              <div className="line"><span>Subtotal</span><strong id="subtotal">{fmt(subtotal)}</strong></div>
              <div className="line"><span>GST 5%</span><strong id="tax">{fmt(tax)}</strong></div>
              <div className="line total"><span>Total</span><strong id="grand">{fmt(grandTotal)}</strong></div>
            </div>
          </div>
          <div className="body">
            <h2>Payment</h2>
            {customerType === 'wallet' ? (
              <div id="walletOptions">
                <div className="row">
                  <label className="radio">
                    <input type="radio" name="paymode" value="wallet" checked={paymentMode === 'wallet'} onChange={e => setPaymentMode(e.target.value as any)} disabled={isBillLocked} /> Wallet
                  </label>
                </div>
              </div>
            ) : (
              <div id="walkinOptions">
                <div className="row">
                  <label className="radio">
                    <input type="radio" name="paymode" value="cash" checked={paymentMode === 'cash'} onChange={e => setPaymentMode(e.target.value as any)} disabled={isBillLocked} /> Cash
                  </label>
                  <label className="radio">
                    <input type="radio" name="paymode" value="card" checked={paymentMode === 'card'} onChange={e => setPaymentMode(e.target.value as any)} disabled={isBillLocked} /> Card
                  </label>
                  <label className="radio">
                    <input type="radio" name="paymode" value="upi" checked={paymentMode === 'upi'} onChange={e => setPaymentMode(e.target.value as any)} disabled={isBillLocked} /> UPI
                  </label>
                </div>
              </div>
            )}
            <div className={`split ${Math.abs(dueAmount) > 0.009 ? 'error' : ''}`}>
              {customerType === 'wallet' && (
                <div className="line">
                  <span className="badge">From Wallet</span>
                  <input id="fromWallet" type="number" min="0" step="0.01" value={fromWallet} onChange={e => setFromWallet(Number(e.target.value))} className="right" style={{ width: 140 }} disabled={isBillLocked} />
                </div>
              )}
              {(customerType === 'walkin' && paymentMode === 'cash') && (
                <div className="line">
                  <span className="badge">Cash</span>
                  <input id="cashAmt" type="number" min="0" step="0.01" value={cashAmt} onChange={e => setCashAmt(Number(e.target.value))} className="right" style={{ width: 140 }} disabled={isBillLocked} />
                </div>
              )}
              {(customerType === 'walkin' && paymentMode === 'card') && (
                <div className="line">
                  <span className="badge">Card</span>
                  <input id="cardAmt" type="number" min="0" step="0.01" value={cardAmt} onChange={e => setCardAmt(Number(e.target.value))} className="right" style={{ width: 140 }} disabled={isBillLocked} />
                </div>
              )}
              {(customerType === 'walkin' && paymentMode === 'upi') && (
                <div className="line">
                  <span className="badge">UPI</span>
                  <input id="upiAmt" type="number" min="0" step="0.01" value={upiAmt} onChange={e => setUpiAmt(Number(e.target.value))} className="right" style={{ width: 140 }} disabled={isBillLocked} />
                </div>
              )}
              <div className="line"><span className="muted">Remaining Wallet Balance</span><strong id="remBal">{fmt(remainingBalance)}</strong></div>
              <div className="line"><span className="muted">Paid</span><strong id="paid">{fmt(paidAmount)}</strong></div>
              <div className="line"><span className="muted">Due</span><strong id="due">{fmt(dueAmount)}</strong></div>
            </div>
          </div>

          <div className="body">
            <h2>WhatsApp Share</h2>
            <div className="row">
              <div className="field">
                <label>Share Message (editable)</label>
                <textarea id="waPreview" placeholder="Message preview will appear here..." value={decodeURIComponent(buildWaMessage().msg.replaceAll('%0A', '\n'))} readOnly />
              </div>
            </div>
          </div>

          <div className="footer">
            <div className="btn-row">
              <button className="btn danger" id="voidBtn" onClick={() => window.location.reload()} disabled={isBillLocked}>Void</button>
              <button className="btn primary" id="confirmBtn" onClick={handleConfirm} disabled={isBillLocked}>Confirm</button>
              <button className="btn" id="whatsappBtn" onClick={handleShareOnWhatsApp}>Share on WhatsApp</button>
            </div>
            <div className="hint">Member ID: <span id="memberIdLabel" className="badge">{selectedMember?.id || '—'}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RestaurantBillingPage;
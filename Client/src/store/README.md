# 📚 Redux Toolkit - Ek File Mein Sab Kuch!

## 🎯 Sirf 1 File - `store.js`

**Sab kuch ek hi file mein hai!** ✨

---

## 📁 File Structure (Bahut Simple!)

```
src/store/
└── store.js  ← Sirf yeh ek file!
```

**Koi folder nahi, koi multiple files nahi!**

---

## 💻 Kaise Use Karein?

### **Step 1: Import karo**

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { addComplaint, updateComplaint } from '../store/store';
```

### **Step 2: Data read karo**

```javascript
function ComplaintsPage() {
  // Redux se data lena
  const complaints = useSelector((state) => state.complaints.items);
  
  return (
    <div>
      {complaints.map(c => (
        <div key={c.id}>{c.title}</div>
      ))}
    </div>
  );
}
```

### **Step 3: Data change karo**

```javascript
function AddComplaint() {
  const dispatch = useDispatch();
  
  const handleAdd = () => {
    dispatch(addComplaint({
      id: Date.now(),
      title: 'New Complaint',
      status: 'Pending'
    }));
  };
  
  return <button onClick={handleAdd}>Add</button>;
}
```

---

## 🎨 Available Actions (Functions)

### Complaints:
```javascript
import { addComplaint, updateComplaint, deleteComplaint } from '../store/store';
```

### Maintenance:
```javascript
import { addMaintenance, updateMaintenance } from '../store/store';
```

### Requests:
```javascript
import { addRequest, updateRequest } from '../store/store';
```

### Flats:
```javascript
import { addFlat, updateFlat } from '../store/store';
```

### Notices:
```javascript
import { addNotice, deleteNotice } from '../store/store';
```

### Residents:
```javascript
import { addResident, updateResident, deleteResident } from '../store/store';
```

### Dashboard:
```javascript
import { updateStats } from '../store/store';
```

### Profile:
```javascript
import { updateProfile } from '../store/store';
```

---

## 📊 Redux State Structure

```javascript
{
  complaints: { items: [...] },
  maintenance: { records: [...] },
  requests: { items: [...] },
  flats: { items: [...] },
  notices: { items: [...] },
  residents: { items: [...] },
  dashboard: { stats: {...} },
  profile: { data: {...} }
}
```

---

## ✅ Benefits

1. ✅ **Sirf 1 file** - Easy to manage
2. ✅ **Sab ek jagah** - Dhoondhna easy
3. ✅ **Simple** - Samajhna easy
4. ✅ **Working** - Fully functional

---

## 🎯 Sir Ko Kaise Samjhaoge

**"Sir, maine Redux Toolkit use kiya hai. Sabhi slices ek hi file mein hain - `store.js`"**

**"Yeh file mein 8 slices hain:**
1. Complaints
2. Maintenance  
3. Requests
4. Flats
5. Notices
6. Residents
7. Dashboard
8. Profile"

**"Har slice mein data aur uske functions hain"**

---

## 💡 Quick Example

```javascript
// Import
import { useSelector, useDispatch } from 'react-redux';
import { addComplaint } from '../store/store';

function MyComponent() {
  const dispatch = useDispatch();
  const complaints = useSelector(state => state.complaints.items);
  
  const handleAdd = () => {
    dispatch(addComplaint({
      id: Date.now(),
      title: 'Test Complaint'
    }));
  };
  
  return (
    <div>
      <button onClick={handleAdd}>Add</button>
      {complaints.map(c => <div key={c.id}>{c.title}</div>)}
    </div>
  );
}
```

---

**Itna hi! Bahut simple! 🎉**

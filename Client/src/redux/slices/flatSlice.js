import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FLAT_API } from "../../services/apis";

/* ================= FETCH FLATS BY WING ================= */
export const fetchFlatsByWing = createAsyncThunk(
  "flats/fetchByWing",
  async (wingId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${FLAT_API.GET_BY_WING}/${wingId}`);
      return res.data.data; // 👈 backend returns { success, data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* ================= CREATE FLAT ================= */
export const createFlat = createAsyncThunk(
  "flats/create",
  async ({ wingId, flatNumber }, { rejectWithValue }) => {
    try {
      const res = await axios.post(FLAT_API.CREATE, {
        wingId,
        flatNumber,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* ================= SLICE ================= */
const flatSlice = createSlice({
  name: "flats",
  initialState: {
    items: [],          // ❌ NO DUMMY DATA
    status: "idle",
    error: null,
  },
  reducers: {
    clearFlats: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchFlatsByWing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFlatsByWing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFlatsByWing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createFlat.fulfilled, (state, action) => {
        state.items.push(action.payload); // realtime UI update
      });
  },
});

export const { clearFlats } = flatSlice.actions;
export default flatSlice.reducer;
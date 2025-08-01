import { createSlice } from "@reduxjs/toolkit";

const chartSlice = createSlice({
  name: "chart",
  initialState: {
    data: [],
    history: [],
  },
  reducers: {
    setChartData: (state, action) => {
      state.data = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
  },
});

export const { setChartData, setHistory } = chartSlice.actions;
export default chartSlice.reducer;
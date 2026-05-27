import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaterialOrder, PurchaseOrder } from "../../lib/types";

interface OrderState {
  loading: boolean;
  materialOrders: MaterialOrder[];
  purchaseOrders: PurchaseOrder[];
  error: string | null;
}

const initialState: OrderState = { loading: false, materialOrders: [], purchaseOrders: [], error: null };

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    ordersRequest(state) { state.loading = true; state.error = null; },
    ordersSuccess(state, action: PayloadAction<MaterialOrder[]>) {
      state.loading = false; state.materialOrders = action.payload;
    },
    orderCreated(state, action: PayloadAction<MaterialOrder>) {
      state.materialOrders = [action.payload, ...state.materialOrders];
    },
    orderUpdated(state, action: PayloadAction<MaterialOrder>) {
      state.materialOrders = state.materialOrders.map((o) =>
        o.orderId === action.payload.orderId ? action.payload : o
      );
    },
    purchaseOrdersSuccess(state, action: PayloadAction<PurchaseOrder[]>) {
      state.loading = false; state.purchaseOrders = action.payload;
    },
    purchaseOrderCreated(state, action: PayloadAction<PurchaseOrder>) {
      state.purchaseOrders = [action.payload, ...state.purchaseOrders];
    },
    purchaseOrderUpdated(state, action: PayloadAction<PurchaseOrder>) {
      state.purchaseOrders = state.purchaseOrders.map((po) =>
        po.purchaseOrderId === action.payload.purchaseOrderId ? action.payload : po
      );
    },
    ordersFailure(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload; },
    clearOrdersError(state) { state.error = null; },
  },
});

export const {
  ordersRequest, ordersSuccess, orderCreated, orderUpdated,
  purchaseOrdersSuccess, purchaseOrderCreated, purchaseOrderUpdated,
  ordersFailure, clearOrdersError,
} = orderSlice.actions;
export default orderSlice.reducer;

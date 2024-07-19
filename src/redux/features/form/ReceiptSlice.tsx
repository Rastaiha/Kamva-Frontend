import { RegistrationReceiptType } from 'types/models';
import { ManageContentServiceApi } from '../ManageContentServiceApiSlice';

export const ReceiptSlice = ManageContentServiceApi.injectEndpoints({
  endpoints: builder => ({
    getReceipt: builder.query<RegistrationReceiptType, { receiptId: string }>({
      providesTags: (result) => [{ type: 'receipt', id: result.id }],
      query: ({ receiptId }) => `fsm/receipts/${receiptId}/`,
      transformResponse: (response: any): RegistrationReceiptType => {
        return response;
      },
    }),

    getMyReceipt: builder.query<RegistrationReceiptType, { formId: string }>({
      providesTags: (result, error, item) => [{ type: 'receipt', id: item.formId }],
      query: ({ formId }) => `fsm/receipts/my_receipt/?form=${formId}`,
      transformResponse: (response: any): RegistrationReceiptType => {
        return response;
      },
    }),
  })
});

export const {
  useGetReceiptQuery,
  useGetMyReceiptQuery,
} = ReceiptSlice;

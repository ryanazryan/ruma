import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  manualTransfer: {
    bankName: process.env.MANUAL_TRANSFER_BANK_NAME ?? '',
    accountNumber: process.env.MANUAL_TRANSFER_ACCOUNT_NUMBER ?? '',
    accountName: process.env.MANUAL_TRANSFER_ACCOUNT_NAME ?? '',
  },
}));
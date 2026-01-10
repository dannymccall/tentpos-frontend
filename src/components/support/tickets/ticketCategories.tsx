export const tentPosTicketCategories = [
  // SALES & TRANSACTIONS
  { key: "Sale Not Completing", value: "sale_not_completing" },
  { key: "Incorrect Sale Total / Tax Calculation", value: "sale_total_tax_errors" },
  { key: "Duplicate Sales Records", value: "duplicate_sales_records" },
  { key: "Refund / Void Sale Issues", value: "refund_void_issues" },
  { key: "Discount / Promotion Not Applying", value: "discount_not_applying" },
  { key: "Wrong Payment Method Applied", value: "wrong_payment_method" },
  { key: "Partial Payment Issues", value: "partial_payment_issues" },

  // PAYMENTS
  { key: "Cash Payment Posting Errors", value: "cash_payment_errors" },
  { key: "Mobile Money Payment Failed", value: "mobile_money_payment_failed" },
  { key: "Card / POS Terminal Errors", value: "card_pos_terminal_errors" },
  { key: "Payment Pending / Stuck", value: "payment_pending_stuck" },
  { key: "Duplicate Payment Records", value: "duplicate_payment_records" },
  { key: "Payment Reversal Requests", value: "payment_reversal_requests" },

  // INVENTORY MANAGEMENT
  { key: "Stock Not Updating After Sale", value: "stock_not_updating" },
  { key: "Incorrect Inventory Balances", value: "inventory_balance_errors" },
  { key: "Product Not Showing at POS", value: "product_not_showing" },
  { key: "Barcode / SKU Scanning Issues", value: "barcode_sku_issues" },
  { key: "Inventory Import / Upload Errors", value: "inventory_import_errors" },
  { key: "Low Stock Alerts Not Triggering", value: "low_stock_alerts_not_triggering" },

  // RECEIPTS & PRINTING
  { key: "Receipt Not Printing", value: "receipt_not_printing" },
  { key: "Incorrect Receipt Format", value: "receipt_format_errors" },
  { key: "Printer Connection Issues", value: "printer_connection_issues" },
  { key: "Duplicate Receipts Generated", value: "duplicate_receipts" },
  { key: "Missing Logo / Business Information", value: "receipt_branding_issues" },

  // USERS, SHIFTS & ACCESS CONTROL
  { key: "Cashier Login Issues", value: "cashier_login_issues" },
  { key: "Shift Opening Errors", value: "shift_opening_errors" },
  { key: "Shift Closing Errors", value: "shift_closing_errors" },
  { key: "Missing Sales After Shift Close", value: "missing_sales_after_shift" },
  { key: "User Permissions / Role Errors", value: "pos_permissions_errors" },
  { key: "Password Reset Issues", value: "pos_password_reset_issues" },

  // BRANCHES, DEVICES & TERMINALS
  { key: "POS Device Registration Issues", value: "pos_device_registration_issues" },
  { key: "Terminal Not Syncing", value: "terminal_sync_issues" },
  { key: "Branch Sales Not Reflecting", value: "branch_sales_not_reflecting" },
  { key: "Offline Mode Issues", value: "offline_mode_issues" },
  { key: "Device Deactivation / Replacement Issues", value: "device_replacement_issues" },

  // REPORTS & RECONCILIATION
  { key: "Daily Sales Report Errors", value: "daily_sales_report_errors" },
  { key: "Z-Report Issues", value: "z_report_issues" },
  { key: "Sales Summary Missing Data", value: "sales_summary_missing_data" },
  { key: "Tax / VAT Report Errors", value: "tax_vat_report_errors" },
  { key: "Report Export Issues (PDF/CSV)", value: "pos_report_export_issues" },

  // SYSTEM & INTEGRATIONS
  { key: "Slow System Performance", value: "pos_system_performance_issues" },
  { key: "App Crashes / Freezes", value: "pos_app_crashes" },
  { key: "Data Sync Issues", value: "pos_data_sync_issues" },
  { key: "API Errors", value: "pos_api_errors" },
  { key: "Payment Gateway Integration Issues", value: "pos_payment_gateway_issues" },
  { key: "Webhook / Callback Failures", value: "pos_webhook_failures" },

  // MISC
  { key: "Feature Request", value: "feature_request" },
  { key: "Training / How-To Help", value: "training_help" },
  { key: "General Inquiry", value: "general_inquiry" }
];

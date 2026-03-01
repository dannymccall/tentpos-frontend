import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
/**
 * TentCore FAQ Page
 * - Self-contained, single-file React component (TypeScript/TSX)
 * - Tailwind + shadcn/ui style components
 * - Searchable, grouped FAQ sections
 * - CTA that points users to the global ticket system
 *
 * Drop this file into a page (e.g. /components/faq/TentCoreFAQ.tsx) and import where needed.
 */

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  group: string;
};

const FAQ_DATA: FaqItem[] = [
  // PRODUCT BASICS
  {
    id: "pos-what",
    question: "What is TentPOS?",
    answer:
      "TentPOS is TentHub’s Point of Sale system that helps you manage products, inventory, sales, customers, payments, and reports from one dashboard for retail and wholesale businesses.",
    group: "Product Basics",
  },
  {
    id: "pos-login",
    question: "How do I log in to TentPOS?",
    answer:
      "Use the credentials provided by your admin or the App Center. If you forget your password, click 'Forgot password' on the login page.",
    group: "Product Basics",
  },
  {
    id: "pos-roles",
    question: "Can I create staff accounts with limited permissions?",
    answer:
      "Yes. Go to Settings → Users & Roles. You can't create staff account on TentPOS, but you can create cashiers, supervisors, or managers and restrict access to sensitive features like reports or refunds.",
    group: "Product Basics",
  },

  // PRODUCTS & INVENTORY
  {
    id: "pos-add-product",
    question: "How do I add a new product?",
    answer:
      "Go to Products → Add Product. Enter the name, price, category, stock quantity, and save. You can also upload products in bulk using CSV import.",
    group: "Products & Inventory",
  },
  {
    id: "pos-stock-update",
    question: "How do I update stock levels?",
    answer:
      "Use Inventory → Stock Adjustment. Avoid manual edits unless correcting mistakes to keep reports accurate.",
    group: "Products & Inventory",
  },
  {
    id: "pos-low-stock",
    question: "How do I know when stock is low?",
    answer:
      "TentPOS will highlight products that fall below the minimum quantity so you can restock early.",
    group: "Products & Inventory",
  },
  // {
  //   id: "pos-barcode",
  //   question: "Can I use barcodes or scanners?",
  //   answer:
  //     "Yes. TentPOS supports barcode scanners. Simply scan the product barcode during checkout to add it instantly to the cart.",
  //   group: "Products & Inventory",
  // },

  // SALES & CHECKOUT
  {
    id: "pos-make-sale",
    question: "How do I process a sale?",
    answer:
      "Open Sales → New Sale, add items to the cart, choose payment method, and confirm. A receipt will be generated automatically.",
    group: "Sales & Checkout",
  },
  {
    id: "pos-discount",
    question: "How do I apply discounts?",
    answer:
      "You can apply discounts on the entire cart. Select the cart total and enter the discount value  before checkout.",
    group: "Sales & Checkout",
  },
  {
    id: "pos-refund",
    question: "How do I process a refund or return?",
    answer:
      "Open the original transaction from Sales History and choose Refund or Return. This ensures inventory and reports stay consistent.",
    group: "Sales & Checkout",
  },
  {
    id: "pos-receipt",
    question: "Can I print or reprint receipts?",
    answer:
      "Yes. After each sale you can print immediately. You can also reprint anytime from Sales History → Select Transaction → Print Receipt.",
    group: "Sales & Checkout",
  },

  // CUSTOMERS & DEBTORS
  {
    id: "pos-add-customer",
    question: "How do I add a customer?",
    answer:
      "Navigate to Customers → New Customer. Add their name and contact details. You can assign credit or track their purchase history.",
    group: "Customers & Debtors",
  },
  {
    id: "pos-credit-sales",
    question: "Does TentPOS support credit sales?",
    answer:
      "Yes. Enable credit mode during checkout. The system tracks outstanding balances and payments from customers automatically.",
    group: "Customers & Debtors",
  },
  {
    id: "pos-debtor-payments",
    question: "How do I record payments from debtors?",
    answer:
      "Open the customer profile, view outstanding invoices, and post a payment. The balance will update instantly.",
    group: "Customers & Debtors",
  },

  // REPORTS
  {
    id: "pos-sales-report",
    question: "Where can I see daily or monthly sales reports?",
    answer:
      "Go to Reports → (Sales Reports, Purchases Report Inventory Reports, Daily Summary). Filter by date range, cashier, or branch to analyze performance.",
    group: "Reports",
  },
  {
    id: "pos-export",
    question: "Can I export reports to Excel or CSV?",
    answer:
      "Yes. Most reports include an Export button. Choose CSV or Excel to download for further analysis or accounting.",
    group: "Reports",
  },
  {
    id: "pos-profit",
    question: "How is profit calculated?",
    answer:
      "Profit is calculated using selling price minus cost price. Ensure cost prices are set correctly when adding products for accurate reporting.",
    group: "Reports",
  },

  // PAYMENTS
  {
    id: "pos-payment-methods",
    question: "What payment methods are supported?",
    answer:
      "TentPOS supports cash, has mobile money payments but not an automation, it is just for reporting",
    group: "Payments",
  },
  // {
  //   id: "pos-payment-failed",
  //   question: "Why did a mobile money or card payment fail?",
  //   answer:
  //     "Failures may be caused by insufficient funds, provider downtime, or network issues. Retry the transaction or verify the provider status.",
  //   group: "Payments",
  // },

  // TECHNICAL
  // {
  //   id: "pos-offline",
  //   question: "Can TentPOS work offline?",
  //   answer:
  //     "Some features may work offline temporarily, but an internet connection is required to sync sales and ensure accurate reporting.",
  //   group: "Technical & Usage",
  // },
  {
    id: "pos-slow",
    question: "What should I do if the POS becomes slow?",
    answer:
      "Refresh the browser, clear cache, or check your internet connection. If the issue persists, contact support with details of the device and time of occurrence.",
    group: "Technical & Usage",
  },
  {
    id: "pos-support",
    question: "How do I get help or report a problem?",
    answer:
      "Use Support → Submit Ticket in the app. Include screenshots, tenantId, and steps to reproduce so our team can assist quickly.",
    group: "Technical & Usage",
  },
];

const GROUP_ORDER = [
  "Product Basics",
  "Products & Inventory",
  "Sales & Checkout",
  "Customers & Debtors",
  "Reports",
  "Payments",
  "Technical & Usage",
];


export default function TentPOSFAQ() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate()
  const filtered = FAQ_DATA.filter((f) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || f.group.toLowerCase().includes(q)
    );
  });

  const grouped: Record<string, FaqItem[]> = {};
  for (const g of GROUP_ORDER) grouped[g] = [];
  for (const item of filtered) {
    if (!grouped[item.group]) grouped[item.group] = [];
    grouped[item.group].push(item);
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Frequently Asked Questions — TentPOS</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Starter FAQ for microfinance operators. Use the search box to find answers, or submit a ticket if you can't find what you need.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions, e.g. 'loan schedule' or 'export'"
              />
            </div>
            <div className="flex items-center md:justify-end">
              <Button onClick={() => setQuery("")}>Clear</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {GROUP_ORDER.map((group) => (
          <section key={group}>
            <h3 className="text-lg font-semibold mb-3">{group}</h3>
            {grouped[group] && grouped[group].length > 0 ? (
              <Accordion type="multiple" defaultValue={grouped[group].slice(0, 3).map((i) => i.id)}>
                {grouped[group].map((f) => (
                  <AccordionItem key={f.id} value={f.id}>
                    <AccordionTrigger>{f.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">{f.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-sm text-muted-foreground">No results in this section.</p>
            )}
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold">Didn't find your answer?</h4>
          <p className="text-sm text-muted-foreground">Submit a support ticket and include tenantId, app (TentPOS/TentCore/etc.), and steps to reproduce.</p>
        </div>
        <div className="flex gap-2">
          {/* Replace the href / onClick with your app's ticket modal or route */}
          <Button variant="outline" onClick={() => navigate("/support/tickets?query=add_ticket")}>Open Support</Button>
          {/* <Button onClick={() => navigate("/docs")}>View Docs</Button> */}
        </div>
      </div>
    </div>
  );
}

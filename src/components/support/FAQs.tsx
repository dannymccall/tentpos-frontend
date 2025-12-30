import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

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
    id: "faq-product-what",
    question: "What is TentCore / Microfinance Module?",
    answer:
      "TentCore is TentHub's microfinance module — it helps institutions manage clients, loans, savings, repayments, branches, and reporting from a single SaaS dashboard.",
    group: "Product Basics",
  },
  {
    id: "faq-product-account-create",
    question: "How do I create an account?",
    answer:
      "To create an account, sign up via the App Center or contact your TentHub onboarding rep. For multi-branch organisations we’ll provision tenant accounts and staff roles for you.",
    group: "Product Basics",
  },
  {
    id: "faq-product-reset-password",
    question: "How do I reset my password?",
    answer:
      "Use the 'Forgot password' link on the login page. If your account is part of a managed tenant, contact your tenant admin to reset your password.",
    group: "Product Basics",
  },

  // LOANS
  {
    id: "faq-loans-register-client",
    question: "How do I register a new client?",
    answer:
      "Navigate to Clients → New Client, fill in the KYC details and attach required documents. Save to create the client profile. You can then proceed to create loan applications for the client.",
    group: "Loans",
  },
  {
    id: "faq-loans-apply",
    question: "How do I apply for a new loan?",
    answer:
      "Open Loans → Create Application, select the borrower, set terms (principal, interest, duration), and submit for approval. The application will go through the configured approval workflow.",
    group: "Loans",
  },
  {
    id: "faq-loans-schedule",
    question: "Why is my loan schedule not generating?",
    answer:
      "Schedules won't generate if required fields (principal, interest rate, repayment frequency, and start date) are missing. Check the application for missing values and try regenerating the schedule.",
    group: "Loans",
  },
  {
    id: "faq-loans-interest",
    question: "How is interest calculated?",
    answer:
      "Interest calculation depends on the product configuration (flat, declining balance, or custom). Check the loan product settings or consult documentation for the product's calculation method.",
    group: "Loans",
  },

  // SAVINGS
  {
    id: "faq-savings-open",
    question: "How do I open a savings account for a client?",
    answer:
      "Go to Savings → New Account, select the client, choose the savings product, and save. You can then post deposits or withdrawals against the account.",
    group: "Savings",
  },
  {
    id: "faq-savings-deposit",
    question: "How do I post a deposit or withdrawal?",
    answer:
      "Open the client's savings account and click Post Transaction. Select Deposit or Withdrawal, enter the amount and reference, then confirm.",
    group: "Savings",
  },

  // REPORTS
  {
    id: "faq-reports-export",
    question: "How do I export reports to PDF or CSV?",
    answer:
      "Most reports include an Export button. Choose PDF or CSV depending on your needs. If export fails, check server logs or submit a ticket with the report name and date range.",
    group: "Reports",
  },
  {
    id: "faq-reports-dashboard",
    question: "Why is my dashboard not updating?",
    answer:
      "Dashboards may update on a schedule. Ensure your user has permission to view the data, and check for any data sync or caching warnings. If the issue persists, submit a ticket with screenshots.",
    group: "Reports",
  },

  // TECHNICAL
  {
    id: "faq-tech-slow",
    question: "What should I do if the system becomes slow or freezes?",
    answer:
      "Try clearing your browser cache and logging in again. If the issue persists, capture the time, user, and steps to reproduce and submit a support ticket so we can investigate.",
    group: "Technical & Usage",
  },
  {
    id: "faq-tech-bug",
    question: "How do I report a bug or issue?",
    answer:
      "Use the Support → Submit Ticket form in your app, include a clear description, screenshots, tenantId, affected module, and steps to reproduce. Attach logs if you have them.",
    group: "Technical & Usage",
  },
  {
    id: "faq-tech-security",
    question: "Is my data secure?",
    answer:
      "Yes — TentHub uses encrypted storage, RBAC-based access, and secure transport (HTTPS). For enterprise customers we offer additional security options and audits.",
    group: "Technical & Usage",
  },

  // PAYMENTS & INTEGRATIONS
  {
    id: "faq-payments-mm",
    question: "How does mobile money integration work?",
    answer:
      "TentCore integrates with local mobile money providers via secure APIs. Payments are posted as transactions and reconciled automatically where supported.",
    group: "Payments & Integrations",
  },
  {
    id: "faq-payments-fail",
    question: "Why did my payment fail?",
    answer:
      "Payment failures can be caused by insufficient funds, provider downtime, or incorrect payment details. Check the payment logs and provider response — if uncertain, submit a ticket with the payment reference.",
    group: "Payments & Integrations",
  },

  // MISC
  {
    id: "faq-misc-feature",
    question: "Can I request a new feature?",
    answer:
      "Yes — submit a Feature Request ticket via Support. Include the business case and expected benefit; our product team reviews requests during planning cycles.",
    group: "Miscellaneous",
  },
  {
    id: "faq-misc-training",
    question: "Do you provide training?",
    answer:
      "Yes — TentHub provides onboarding and training packages for customers. Contact your account manager or submit a ticket to request a training session.",
    group: "Miscellaneous",
  },
];

const GROUP_ORDER = [
  "Product Basics",
  "Loans",
  "Savings",
  "Reports",
  "Technical & Usage",
  "Payments & Integrations",
  "Miscellaneous",
];

export default function TentPOSFAQ() {
  const [query, setQuery] = useState("");

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
          <CardTitle>Frequently Asked Questions — TentCore</CardTitle>
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
          <Button variant="ghost" onClick={() => window?.location?.assign("/support/tickets?query=add_ticket")}>Open Support</Button>
          <Button onClick={() => window?.location?.assign("/docs")}>View Docs</Button>
        </div>
      </div>
    </div>
  );
}

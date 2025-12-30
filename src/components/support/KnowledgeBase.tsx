import  { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// Knowledge Base Data Structure
const kbData = [
  {
    id: "getting-started",
    title: "Getting Started",
    articles: [
      { id: "what-is-tentcore", title: "What is TentCore?", content: "TentCore is the core microfinance engine within TentHub..." },
      { id: "how-to-login", title: "How to Log In", content: "Steps to access your account..." },
      { id: "understanding-tenants", title: "Understanding Tenant, Branch & Staff", content: "Explanation of the multi-tenant structure..." },
    ],
  },
  {
    id: "clients",
    title: "Clients & Customers",
    articles: [
      { id: "register-client", title: "How to Register a Client", content: "Steps for adding a new client..." },
      { id: "client-documents", title: "Uploading Client Documents", content: "How to add files to a client profile..." },
    ],
  },
  {
    id: "loans",
    title: "Loans",
    articles: [
      { id: "loan-application", title: "Loan Application Process", content: "How loan applications work..." },
      { id: "loan-approval", title: "Approving Loans", content: "Steps to review and approve loans..." },
      { id: "loan-schedules", title: "Loan Schedule Generation", content: "Overview of how schedules are generated..." },
    ],
  },
  {
    id: "savings",
    title: "Savings",
    articles: [
      { id: "opening-savings", title: "Opening Savings Accounts", content: "How to create a savings account..." },
      { id: "deposit-flow", title: "Deposit Workflow", content: "Steps to make deposits..." },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    articles: [
      { id: "general-reports", title: "Running General Reports", content: "How to generate various reports..." },
      { id: "exporting", title: "Export Formats", content: "CSV/PDF export features..." },
    ],
  },
];

// Category List Component
export const KnowledgeBaseCategories = ({ onSelectCategory }: any) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kbData.map((cat) => (
        <Card
          key={cat.id}
          className="cursor-pointer hover:shadow-xl transition"
          onClick={() => onSelectCategory(cat)}
        >
          <CardHeader>
            <CardTitle>{cat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {cat.articles.length} Articles
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Article List per Category
export const KnowledgeBaseCategoryView = ({ category, onBack }: any) => {
  return (
    <div>
      <Button variant="outline" className="mb-4" onClick={onBack}>
        Back
      </Button>
      <h2 className="text-2xl font-semibold mb-6">{category.title}</h2>

      <Accordion type="single" collapsible className="w-full">
        {category.articles.map((article: any) => (
          <AccordionItem key={article.id} value={article.id}>
            <AccordionTrigger>{article.title}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm leading-relaxed">{article.content}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Main Knowledge Base Page
export default function KnowledgeBase() {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [query, setQuery] = useState("");


  return (
    <div className="space-y-8 p-5">
      <div className="flex justify-between items-center">
      </div>

      <Input
        placeholder="Search categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />

      {!selectedCategory ? (
        <KnowledgeBaseCategories onSelectCategory={setSelectedCategory} />
      ) : (
        <KnowledgeBaseCategoryView
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}
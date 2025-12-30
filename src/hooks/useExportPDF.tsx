import { useAuth } from "@/context/AuthContext";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportPDFOptions<T> {
  headers: string[];
  data: T[];
  fileName?: string;
  title?: string;
  orientation?: "portrait" | "landscape";
  mapRow?: (item: T) => (string | number)[];
}

export interface UseExportPDFResult {
  exportPDF: <T>(options: ExportPDFOptions<T>) => Promise<void>;
}

export function useExportPDF(): UseExportPDFResult {
  const { settings, user } = useAuth();

  const exportPDF = async <T,>(options: ExportPDFOptions<T>) => {
    const {
      headers,
      data,
      fileName = "report.pdf",
      title = "Data Report",
      mapRow,
      orientation = "portrait",
    } = options;

    const doc:any = new jsPDF({ orientation });

    // WATERMARK (faint company name)
    if (settings?.companyName) {
      doc.setFontSize(60);
      doc.setTextColor(200, 200, 200);
      doc.text(settings.companyName, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, {
        align: "center",
        angle: 30,
      });
    }

    // HEADER SECTION RESET
    doc.setTextColor(0, 0, 0);

    // Insert Logo (centered)
    if (settings?.logo) {
      try {
        const res = await fetch(settings.logo);
        const blob = await res.blob();
        const reader = new FileReader();

        const base64Logo: string = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = 30;
        const imgX = (pageWidth - imgWidth) / 2; // center
        doc.addImage(base64Logo, "PNG", imgX, 10, imgWidth, 30);
      } catch {}
    }

    // Company Name (bold and centered)
    if (settings?.companyName) {
      doc.setFontSize(18);
      doc.text(settings.companyName, doc.internal.pageSize.getWidth() / 2, 50, { align: "center" });
    }

    // Address / Contact (center)
    if (user?.fullName || "") {
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(
        [user?.role ?? "", user?.username ].filter(Boolean).join(" | "),
        doc.internal.pageSize.getWidth() / 2,
        58,
        { align: "center" }
      );
    }

    // Report Title (center)
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 72, { align: "center" });

    // "Prepared for" section
    if (user?.fullName) {
      doc.setFontSize(10);
      doc.text(`Prepared for: ${user.fullName}`, 14, 82);
    }

    const tableStartY = 90;

    const body = data.map((item) =>
      mapRow
        ? mapRow(item)
        : headers.map((h) => {
            const value = (item as any)[h];
            return value !== undefined && value !== null ? String(value) : "";
          })
    );

    autoTable(doc, {
      head: [headers],
      body,
      startY: tableStartY,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [52, 73, 94] },
      didDrawPage: () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // FOOTER (company + date)
        const dateStr = new Date().toLocaleDateString();
        const footerText = `${settings?.companyName ?? ""} • ${dateStr}`;
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(footerText, 14, pageHeight - 10);

        // PAGE NUMBER
        const pageNumber = doc.internal.getNumberOfPages();
        doc.text(`Page ${pageNumber}`, pageWidth - 20, pageHeight - 10, { align: "right" });
      },
    });

    doc.save(fileName);
  };

  return { exportPDF };
}

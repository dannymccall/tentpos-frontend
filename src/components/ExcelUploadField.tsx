type ExcelUploadFieldProps<T = string[]> = {
  title?: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: (headers: Partial<T>, fileName: string) => void;
};

const ExcelUploadField: React.FC<ExcelUploadFieldProps> = ({
  title = "Bulk Upload (Excel)",
  onFileUpload,
  onDownloadTemplate,
}) => {
  return (
    <div>
      <h2 className="md:text-base text-sm font-bold mb-4">
        {title}
      </h2>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        
        {/* File Upload */}
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => onFileUpload(e)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
        />

        {/* Download Template */}
        <button
          onClick={() => onDownloadTemplate([], "template.xlsx")}
          className="px-4 py-2 bg-[#1d3449] text-white rounded-md hover:bg-gray-700 text-xs md:text-sm whitespace-nowrap"
        >
          Download Template
        </button>

      </div>
    </div>
  );
};

export default ExcelUploadField;
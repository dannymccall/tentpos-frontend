const apiUrl = import.meta.env.VITE_API_URL;
export async function makeRequest(url: string, options: RequestInit) {
  const sessionId = localStorage.getItem("tentpos:sessionId");
  console.log({sessionId})
  try {
    const response = await fetch(`${apiUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
        "Content-Type": "application/json",
      },
      ...options,
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: `HTTP_${response.status}`,
          message: data?.message || response.statusText || "Unknown error",
        },
      };
    }

    return {
      status: "success",
      message: data?.message || "Request was successful.",
      data,
    };
  } catch (error: any) {
    console.log(error)
    return {
      status: "error",
      error: {
        code: "NETWORK_ERROR",
        message:
          error?.message ||
          "Failed to connect to the server. Please try again later.",
      },
    };
  }
}


export function getTimeAgo(dateInput: Date | string) {
  const now = new Date();
  const postDate = new Date(dateInput);
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHS",
  }).format(value);

export function toCapitalized(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function blobToFile(blobType: string, imageName: string) {
  try {
    const res = await fetch(blobType, { method: "GET" });

    if (!res.ok) {
      console.log(res.statusText);
      return;
    }

    const blob = await res.blob();

    // Extract file extension from blob type
    const extension = blob.type.split("/")[1] || "png"; // Default to png if unknown

    // Ensure the filename has the correct extension
    const finalFileName = imageName.includes(".")
      ? imageName
      : `${imageName}.${extension}`;

    const file = new File([blob], finalFileName, { type: blob.type });

    // console.log(file);
    return file;
  } catch (e: any) {
    console.log(e.message);
  }
}

console.log("helperFunctions loaded");
export function formatDate(dob: any) {
  let date = new Date(dob);

  if (date instanceof Date) {
    // Format the date as YYYY-MM-DD
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`; // Returns date in YYYY-MM-DD format
  } else {
    return "Invalid date";
  }
}

const getRandomColor = () => {
  const colors = [
    "#f87171",
    "#60a5fa",
    "#34d399",
    "#facc15",
    "#a78bfa",
    "#f472b6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getPlaceholderSVG = (title: string) => {
  const color = getRandomColor();
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='${color}'/%3E%3Ctext x='50%' y='50%' font-size='32' text-anchor='middle' fill='white' dy='.3em'%3E${encodeURIComponent(
    title
  )}%3C/text%3E%3C/svg%3E`;
};

export const currency = (n: number) =>
  `₵${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const toMoney = (n: number) =>
  Math.round((n + Number.EPSILON) * 100) / 100;

export const getSaleStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-emerald-600 text-white"; // payment completed

    case "PENDING":
      return "bg-yellow-400 text-black"; // awaiting payment

    case "UNPAID":
      return "bg-orange-500 text-white"; // not paid at all

    case "CANCELLED":
      return "bg-red-500 text-white"; // sale cancelled

    case "VOID":
      return "bg-gray-500 text-white"; // voided transaction

    case "RETURN":
      return "bg-indigo-500 text-white"; // sale returned

    default:
      return "bg-gray-300 text-black"; // fallback
  }
};

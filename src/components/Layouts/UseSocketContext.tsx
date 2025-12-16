// import { SocketProvider } from "@/context/SocketContext";
// import React from "react";
// import { useAuth } from "../../context/AuthContext";

// const UseSocketContext = ({ children }: { children: React.ReactNode }) => {
//   const { user, businessProfile } = useAuth();
//   return (
//     <SocketProvider
//       tenantId={(user as any)?.tenantId}
//       role={
//         businessProfile?.userRole ? businessProfile?.userRole.role.name! : null
//       }
//       branchId={businessProfile?.branch ? businessProfile?.branch.name : null}
//       userId={businessProfile?.id!}
//     >
//       {children}
//     </SocketProvider>
//   );
// };

// export default UseSocketContext;

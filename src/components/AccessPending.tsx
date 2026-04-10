import { motion } from "framer-motion";
import { Button } from "./Button";

type Props = {
  appName?: string;
  hasRole: boolean;
  hasDataScope: boolean;
  branchLocation: boolean
};
export default function AccessPending({
  appName = "TentPOS",
  hasRole,
  hasDataScope,
  branchLocation
}: Props) {

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="text-center max-w-md w-full">

        {/* Animated Lock */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center text-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span className="text-5xl">🔒</span>
        </motion.div>

        {/* Title */}
        <h2 className="text-base md:text-base font-semibold mb-2">
          Access Pending
        </h2>

        {/* Message */}
        <p className="text-gray-500 mb-6 text-sm">
          Your account is not fully set up for <strong>{appName}</strong>.
          Please contact your administrator to assign your role and access permissions.
        </p>

        {/* Status Indicators */}
        <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2">
          <StatusItem label="App Access" status={true} />
          <StatusItem label="Role Assigned" status={hasRole} />
          <StatusItem label="Data Access" status={hasDataScope} />
          <StatusItem label="Branch Location" status={branchLocation} />
        </div>
        <div className="pt-7">
            <Button size={"sm"} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={status ? "text-green-600" : "text-red-500"}>
        {status ? "Configured" : "Not Set"}
      </span>
    </div>
  );
}
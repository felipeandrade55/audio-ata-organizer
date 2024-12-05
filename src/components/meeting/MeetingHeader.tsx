import { motion } from "framer-motion";
import { CardTitle } from "@/components/ui/card";

const MeetingHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-2 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-t-lg p-6"
    >
      <CardTitle className="text-center text-2xl md:text-4xl font-bold tracking-tight">
        ATA DE REUNIÃO
      </CardTitle>
    </motion.div>
  );
};

export default MeetingHeader;
import { motion } from "framer-motion";
import { User, Users } from "lucide-react";
import { Participant } from "@/types/meeting";

interface ParticipantsListProps {
  participants: Participant[];
}

const ParticipantsList = ({ participants }: ParticipantsListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Users className="h-6 w-6 text-purple-500" />
        <h3 className="text-xl font-semibold">Participantes</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.map((participant, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <User className="h-5 w-5 text-gray-500" />
            <span className="font-medium">
              {participant.name} {participant.role && `- ${participant.role}`}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ParticipantsList;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { MeetingMinutes } from "@/types/meeting";
import { Calendar, Clock, MapPin, Users, FileText, CheckSquare, ListTodo, FileCheck, User } from "lucide-react";
import { motion } from "framer-motion";

interface MeetingMinutesDisplayProps {
  minutes: MeetingMinutes;
}

const MeetingMinutesDisplay = ({ minutes }: MeetingMinutesDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <Card className="w-full max-w-5xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-2 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-t-lg p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="text-center text-2xl md:text-4xl font-bold tracking-tight">
              ATA DE REUNIÃO
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-8 p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="flex items-center space-x-4 p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="h-6 w-6 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data</p>
                <p className="text-lg font-semibold">{minutes.date}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4 p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Clock className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Horário</p>
                <p className="text-lg font-semibold">{minutes.startTime} - {minutes.endTime}</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4 p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Local</p>
                <p className="text-lg font-semibold">{minutes.location}</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4 p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <FileText className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reunião</p>
                <p className="text-lg font-semibold">{minutes.meetingTitle}</p>
              </div>
            </motion.div>
          </div>

          <Separator className="my-8" />

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
              {minutes.participants.map((participant, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">{participant.name} {participant.role && `- ${participant.role}`}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Separator className="my-8" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <ListTodo className="h-6 w-6 text-blue-500" />
              <h3 className="text-xl font-semibold">Pauta da Reunião</h3>
            </div>
            <div className="space-y-4">
              {minutes.agendaItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                    Pauta {index + 1}: {item.title}
                  </h4>
                  {item.discussion && (
                    <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {item.discussion}
                    </p>
                  )}
                  {item.responsible && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-purple-600 dark:text-purple-400">Responsável:</span> {item.responsible}
                    </p>
                  )}
                  {item.decision && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-blue-600 dark:text-blue-400">Decisão:</span> {item.decision}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Separator className="my-8" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <CheckSquare className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-semibold">Ações Definidas</h3>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold">Tarefa</TableHead>
                    <TableHead className="font-semibold">Responsável</TableHead>
                    <TableHead className="font-semibold">Prazo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {minutes.actionItems.map((action, index) => (
                    <TableRow 
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell className="font-medium">{action.task}</TableCell>
                      <TableCell>{action.responsible}</TableCell>
                      <TableCell>{action.deadline}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>

          <Separator className="my-8" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <FileCheck className="h-6 w-6 text-indigo-500" />
                <h3 className="text-xl font-semibold">Resumo da Reunião</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {minutes.summary}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Próximos Passos</h3>
              <div className="space-y-3">
                {minutes.nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <Separator className="my-8" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <User className="h-6 w-6 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Elaborado por</p>
                <p className="text-lg font-semibold">{minutes.author}</p>
              </div>
            </div>
            {minutes.approver && (
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <User className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aprovado por</p>
                  <p className="text-lg font-semibold">{minutes.approver}</p>
                </div>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MeetingMinutesDisplay;
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
    >
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="space-y-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-center text-2xl md:text-3xl font-bold">ATA DE REUNIÃO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data</p>
                <p className="text-lg">{minutes.date}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Horário</p>
                <p className="text-lg">{minutes.startTime} - {minutes.endTime}</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Local</p>
                <p className="text-lg">{minutes.location}</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <FileText className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reunião</p>
                <p className="text-lg">{minutes.meetingTitle}</p>
              </div>
            </motion.div>
          </div>

          <Separator className="my-6" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold">Participantes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {minutes.participants.map((participant, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{participant.name} {participant.role && `- ${participant.role}`}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Separator className="my-6" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <ListTodo className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Pauta da Reunião</h3>
            </div>
            <div className="space-y-4">
              {minutes.agendaItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="font-semibold mb-2">Pauta {index + 1}: {item.title}</h4>
                  {item.discussion && <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.discussion}</p>}
                  {item.responsible && (
                    <p className="text-sm">
                      <span className="font-medium text-purple-600 dark:text-purple-400">Responsável:</span> {item.responsible}
                    </p>
                  )}
                  {item.decision && (
                    <p className="text-sm">
                      <span className="font-medium text-blue-600 dark:text-blue-400">Decisão:</span> {item.decision}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Separator className="my-6" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <CheckSquare className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold">Ações Definidas</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Prazo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {minutes.actionItems.map((action, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{action.task}</TableCell>
                      <TableCell>{action.responsible}</TableCell>
                      <TableCell>{action.deadline}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>

          <Separator className="my-6" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileCheck className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-semibold">Resumo da Reunião</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{minutes.summary}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Próximos Passos</h3>
              <div className="space-y-2">
                {minutes.nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <span className="text-sm text-purple-600 dark:text-purple-400">{index + 1}</span>
                    </div>
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <Separator className="my-6" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Elaborado por</p>
                <p className="text-lg">{minutes.author}</p>
              </div>
            </div>
            {minutes.approver && (
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aprovado por</p>
                  <p className="text-lg">{minutes.approver}</p>
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
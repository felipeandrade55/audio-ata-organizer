import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface AvatarUploadProps {
  avatarUrl: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarUpload = ({ avatarUrl, onAvatarChange }: AvatarUploadProps) => {
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Label htmlFor="avatar" className="text-sm font-medium">
        Foto de Perfil
      </Label>
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 border-2 border-purple-200 dark:border-purple-900">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            <User className="w-8 h-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
          className="max-w-[220px] cursor-pointer file:cursor-pointer file:text-purple-600 dark:file:text-purple-400"
        />
      </div>
    </motion.div>
  );
};
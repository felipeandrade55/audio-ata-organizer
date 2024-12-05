import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
}

interface MeetingCommentsProps {
  comments: Comment[];
  onAddComment: (comment: string) => void;
}

const MeetingComments = ({ comments, onAddComment }: MeetingCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    onAddComment(newComment);
    setNewComment("");
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <CardTitle className="text-lg">Comentários</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] mb-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="mb-4 border-b pb-2 last:border-0 last:pb-0"
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium">{comment.author}</span>
                <span className="text-muted-foreground">{comment.date}</span>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
          ))}
        </ScrollArea>
        <div className="flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Adicione um comentário..."
            className="min-h-[80px]"
          />
          <Button onClick={handleSubmit} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingComments;
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, Eye, EyeOff, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { getUserFriendlyError, getDeleteErrorMessage } from "@/lib/errorUtils";

export const MessagesViewer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggleRead = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("contact_messages").update({ is_read: !currentStatus }).eq("id", id);
    if (error) toast({ title: "Error", description: getUserFriendlyError(error), variant: "destructive" });
    else queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast({ title: "Error", description: getDeleteErrorMessage(error), variant: "destructive" });
    else {
      toast({ title: "Deleted", description: "Message removed" });
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
    }
  };

  const unreadCount = messages?.filter((m) => !m.is_read).length || 0;

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-display font-bold">Messages ({messages?.length || 0})</h2>
          {unreadCount > 0 && <Badge className="gradient-bg">{unreadCount} unread</Badge>}
        </div>
      </div>

      {messages?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`p-4 md:p-6 rounded-xl bg-card border transition-all ${!message.is_read ? "border-primary/50 bg-primary/5" : ""}`}
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!message.is_read ? "gradient-bg" : "bg-muted"}`}>
                    <Mail className={`w-5 h-5 ${!message.is_read ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{message.name}</h3>
                    <a href={`mailto:${message.email}`} className="text-sm text-primary hover:underline">{message.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{format(new Date(message.created_at), "MMM d, yyyy h:mm a")}</span>
                  <Button size="sm" variant="ghost" onClick={() => toggleRead(message.id, message.is_read || false)}>
                    {message.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(message.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {message.budget && (
                <Badge variant="secondary" className="mb-3">Budget: {message.budget}</Badge>
              )}
              
              <p className="text-foreground whitespace-pre-wrap">{message.project_details}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

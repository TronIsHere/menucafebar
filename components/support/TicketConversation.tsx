"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "@/lib/icons/app-icons";
import { formatJalaliDateTime } from "@/lib/dates/jalali";
import { AUTHOR_ROLE_LABELS } from "@/lib/support/constants";
import { cn } from "@/lib/utils";

export interface TicketMessage {
  _id?: string;
  authorId: string;
  authorRole: "owner" | "admin";
  authorName: string;
  body: string;
  createdAt: string;
}

interface Props {
  messages: TicketMessage[];
  disabled?: boolean;
  onSend: (body: string) => Promise<void>;
  placeholder?: string;
}

export function TicketConversation({
  messages,
  disabled,
  onSend,
  placeholder = "پیام خود را بنویسید...",
}: Props) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const trimmed = body.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      await onSend(trimmed);
      setBody("");
    } catch {
      toast.error("خطا در ارسال پیام");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3 max-h-[420px] overflow-y-auto rounded-lg border border-border bg-muted/20 p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            هنوز پیامی ثبت نشده است
          </p>
        ) : (
          messages.map((msg, i) => {
            const isAdmin = msg.authorRole === "admin";
            return (
              <div
                key={msg._id ?? i}
                className={cn(
                  "flex flex-col gap-1 max-w-[85%]",
                  isAdmin ? "ms-auto items-end" : "me-auto items-start"
                )}
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{isAdmin ? AUTHOR_ROLE_LABELS.admin : AUTHOR_ROLE_LABELS.owner}</span>
                  <span>·</span>
                  <span>{formatJalaliDateTime(msg.createdAt)}</span>
                </div>
                <div
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                    isAdmin
                      ? "bg-primary text-primary-foreground rounded-es-sm"
                      : "bg-card border border-border rounded-ee-sm"
                  )}
                >
                  {msg.body}
                </div>
              </div>
            );
          })
        )}
      </div>

      {!disabled && (
        <div className="flex gap-2">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !body.trim()}
            className="shrink-0 self-end cursor-pointer"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

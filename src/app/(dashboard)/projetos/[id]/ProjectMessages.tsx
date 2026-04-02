'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'

export function ProjectMessages({ projectId, userId }: { projectId: string, userId: string }) {
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [content, setContent] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase.from('messages').select('*').eq('project_id', projectId).order('created_at', { ascending: true })
    if (data) setMessages(data)
    setLoading(false)
  }, [projectId, supabase])

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('project_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` }, 
      (payload) => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [projectId, fetchMessages, supabase])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSending(true)

    await supabase.from('messages').insert({
      project_id: projectId,
      sender_id: userId,
      content: content.trim()
    })

    setContent('')
    setSending(false)
  }

  return (
    <Card className="flex flex-col h-[600px] border-0 shadow-card-subtle bg-surface overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {loading ? (
          <div className="flex justify-center h-full items-center"><Loader2 className="animate-spin text-text-secondary" /></div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col h-full items-center justify-center text-text-secondary">
             <p>Sem mensagens. Inicie a conversa!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_id === userId
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-3 rounded-lg text-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-background border border-border rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 bg-background border-t border-border focus-within:ring-1 focus-within:ring-primary">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Textarea 
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Escreva uma mensagem..."
            className="min-h-[40px] max-h-[120px] bg-transparent border-0 ring-offset-0 focus-visible:ring-0 resize-none shadow-none"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); sendMessage(e as unknown as React.FormEvent);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={sending || !content.trim()} className="h-10 w-10 mt-auto shrink-0 bg-primary text-white hover:bg-primary-light">
            {sending ? <Loader2 className="animate-spin" /> : <Send size={18} />}
          </Button>
        </form>
      </div>
    </Card>
  )
}

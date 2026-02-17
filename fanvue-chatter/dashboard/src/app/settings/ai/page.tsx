'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User, Settings2 } from "lucide-react"

export default function AISettingsPage() {
  const [provider, setProvider] = useState("openai")
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState(150)
  const [testMessages, setTestMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
  ])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    const newMessages = [...testMessages, { role: "user", content: inputMessage }]
    setTestMessages(newMessages)
    setInputMessage("")
    
    // Simulate AI response
    setTimeout(() => {
      setTestMessages((prev) => [
        ...prev,
        { role: "assistant", content: `I received: "${inputMessage}". This is a simulated response.` }
      ])
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Configuration</h1>
        <Button>
          <Settings2 className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Settings</CardTitle>
              <CardDescription>Choose your AI backend.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>AI Provider</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="ollama">Ollama (Local)</SelectItem>
                    <SelectItem value="custom">Custom API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {provider === "openai" && (
                <>
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="sk-..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select defaultValue="gpt-4o">
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {provider === "ollama" && (
                <>
                  <div className="space-y-2">
                    <Label>Base URL</Label>
                    <Input placeholder="http://localhost:11434" defaultValue="http://localhost:11434" />
                  </div>
                  <div className="space-y-2">
                    <Label>Model Name</Label>
                    <Input placeholder="hermes3:8b" defaultValue="hermes3:8b" />
                  </div>
                </>
              )}

              {provider === "custom" && (
                <>
                  <div className="space-y-2">
                    <Label>Base URL</Label>
                    <Input placeholder="https://api.example.com/v1" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Key..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Model ID</Label>
                    <Input placeholder="my-custom-model" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generation Parameters</CardTitle>
              <CardDescription>Fine-tune the response characteristics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Temperature (0-2)</Label>
                  <span className="text-sm text-muted-foreground">{temperature}</span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={2}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Tokens</Label>
                <Input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col h-[600px]">
          <CardHeader>
            <CardTitle>Test Chat</CardTitle>
            <CardDescription>Verify your settings in real-time.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-md bg-muted/50">
              {testMessages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

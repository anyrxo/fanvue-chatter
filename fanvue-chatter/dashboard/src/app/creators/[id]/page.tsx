'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { MessageSquare, DollarSign, Users, Clock, Upload, Trash2, Save, FileText } from "lucide-react"
import { useParams } from "next/navigation"

// Mock Data
const fansData = [
  { id: 1, name: "Fan123", tier: "whale", totalSpent: "$1,200", lastActive: "2m ago", messages: 154 },
  { id: 2, name: "SimpKing", tier: "spender", totalSpent: "$450", lastActive: "1h ago", messages: 89 },
  { id: 3, name: "NewGuy", tier: "free", totalSpent: "$0", lastActive: "1d ago", messages: 12 },
]

const contentData = [
  { id: 1, url: "https://placehold.co/150", price: "$15", tags: ["lingerie", "teaser"] },
  { id: 2, url: "https://placehold.co/150", price: "$25", tags: ["exclusive", "video"] },
  { id: 3, url: "https://placehold.co/150", price: "$50", tags: ["custom", "photo"] },
]

const statsData = [
  { name: "Mon", total: 120 },
  { name: "Tue", total: 240 },
  { name: "Wed", total: 180 },
  { name: "Thu", total: 320 },
  { name: "Fri", total: 450 },
  { name: "Sat", total: 560 },
  { name: "Sun", total: 490 },
]

const chatLog = [
  { role: "fan", content: "Hey beautiful, what are you up to?", time: "10:00 AM" },
  { role: "ai", content: "Just thinking about you... want to see what I'm wearing?", time: "10:01 AM", meta: { intent: "flirt", signal: "high" } },
  { role: "fan", content: "Yes please!", time: "10:02 AM" },
  { role: "ai", content: "[Sent Image] Do you like it?", time: "10:02 AM", meta: { intent: "sell", signal: "buying" } },
]

export default function CreatorDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState("persona")
  const [sextingIntensity, setSextingIntensity] = useState([3])
  const [upsellFrequency, setUpsellFrequency] = useState([50])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Creator Details</h1>
        <div className="flex items-center gap-2">
           <Button variant="outline">Discard Changes</Button>
           <Button>
             <Save className="mr-2 h-4 w-4" />
             Save Changes
           </Button>
        </div>
      </div>

      <div className="flex items-center space-x-1 border-b">
        {["persona", "content", "fans", "stats"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            } capitalize`}
          >
            {tab === "content" ? "Content Vault" : tab}
          </button>
        ))}
      </div>

      {activeTab === "persona" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Persona Settings</CardTitle>
              <CardDescription>Define how the AI behaves and interacts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Style</Label>
                <Select defaultValue="girl_next_door">
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="girl_next_door">Girl Next Door</SelectItem>
                    <SelectItem value="dominant">Dominant</SelectItem>
                    <SelectItem value="best_friend">Best Friend</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>System Prompt</Label>
                <Textarea placeholder="You are a 24 year old..." className="min-h-[150px]" />
              </div>
              <div className="space-y-2">
                <Label>Boundaries (comma separated)</Label>
                <Input placeholder="No politics, no religion..." />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Behavior Tuning</CardTitle>
              <CardDescription>Adjust the AI's conversation dynamics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Sexting Intensity (1-5)</Label>
                  <span className="text-sm text-muted-foreground">{sextingIntensity}</span>
                </div>
                <Slider
                  value={sextingIntensity}
                  onValueChange={setSextingIntensity}
                  max={5}
                  min={1}
                  step={1}
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Upsell Frequency (0-100%)</Label>
                  <span className="text-sm text-muted-foreground">{upsellFrequency}%</span>
                </div>
                <Slider
                  value={upsellFrequency}
                  onValueChange={setUpsellFrequency}
                  max={100}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "content" && (
        <div className="grid gap-6">
          <div className="flex justify-end">
             <Button>
               <Upload className="mr-2 h-4 w-4" />
               Upload Content
             </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {contentData.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-square bg-muted relative group">
                  <img src={item.url} alt="Content" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <Button variant="destructive" size="icon" className="h-8 w-8">
                       <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{item.price}</span>
                    <Badge variant="secondary" className="text-xs">{item.tags[0]}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "fans" && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fan Name</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fansData.map((fan) => (
                <TableRow key={fan.id}>
                  <TableCell className="font-medium">{fan.name}</TableCell>
                  <TableCell>
                    <Badge variant={fan.tier === 'whale' ? 'default' : fan.tier === 'spender' ? 'secondary' : 'outline'}>
                      {fan.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>{fan.totalSpent}</TableCell>
                  <TableCell>{fan.lastActive}</TableCell>
                  <TableCell>{fan.messages}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat Log
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                        <DialogHeader>
                          <DialogTitle>Chat History with {fan.name}</DialogTitle>
                          <DialogDescription>View the full conversation and AI reasoning.</DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-md bg-muted/50">
                          {chatLog.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.role === 'ai' ? 'items-end' : 'items-start'}`}>
                              <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                <span>{msg.time}</span>
                                {msg.meta && (
                                  <span className="text-yellow-500 font-mono">
                                    [{msg.meta.intent}]
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {activeTab === "stats" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.3%</div>
              <p className="text-xs text-muted-foreground">+1.2% from last month</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12s</div>
              <p className="text-xs text-muted-foreground">-2s from last month</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Fans</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">+180 from last month</p>
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={statsData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                     cursor={{ fill: 'transparent' }}
                     contentStyle={{ borderRadius: '8px' }}
                  />
                  <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

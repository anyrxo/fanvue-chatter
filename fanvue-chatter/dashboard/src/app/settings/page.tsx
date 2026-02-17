'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Key } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const sampleApiKeys = [
  { id: 1, name: "Production Key", preview: "sk_live_...xxxx", created: "—", lastUsed: "Never" },
]

export default function SettingsPage() {
  const [email, setEmail] = useState<string>("Loading...")
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? "Unknown")
    })
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your account details and security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={email} readOnly disabled />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Button variant="outline" className="w-full justify-start">Change Password</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>Receive real-time updates for events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="flex gap-2">
                  <Input placeholder="https://your-server.com/webhook" />
                  <Button>Save</Button>
                </div>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API keys for external access.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key Preview</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleApiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="font-mono text-xs">{key.preview}</TableCell>
                    <TableCell>{key.created}</TableCell>
                    <TableCell>{key.lastUsed}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                         <Trash2 className="h-4 w-4" />
                         Revoke
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/50 px-6 py-4">
            <Button variant="outline" size="sm">
              <Key className="mr-2 h-4 w-4" />
              Generate New Key
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between">
               <div>
                 <p className="font-medium">Delete Account</p>
                 <p className="text-sm text-muted-foreground">Permanently remove your account and all data.</p>
               </div>
               <Button variant="destructive">Delete Account</Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

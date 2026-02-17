'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Send, Calendar, Paperclip } from "lucide-react"

const campaigns = [
  {
    id: 1,
    date: "2023-10-25",
    creator: "Alice Wonderland",
    target: "Subscribers",
    message: "Hey sweetie, check out my new...",
    delivered: 1250,
    revenue: "$450",
    status: "Completed",
  },
  {
    id: 2,
    date: "2023-10-28",
    creator: "Cindy Star",
    target: "Top Spenders",
    message: "Special treat for my favorite...",
    delivered: 150,
    revenue: "$1,200",
    status: "Sent",
  },
  {
    id: 3,
    date: "2023-11-01",
    creator: "Bella Thorne",
    target: "Expired Subscribers",
    message: "Miss me? Come back for 50% off...",
    delivered: 300,
    revenue: "$0",
    status: "Scheduled",
  },
]

export default function CampaignsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Broadcast messages and PPVs to your fans.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Send a mass message or PPV to a specific segment of fans.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="creator" className="text-right">
                  Creator
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select creator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice Wonderland</SelectItem>
                    <SelectItem value="bella">Bella Thorne</SelectItem>
                    <SelectItem value="cindy">Cindy Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target" className="text-right">
                  Target
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fans</SelectItem>
                    <SelectItem value="subscribers">Active Subscribers</SelectItem>
                    <SelectItem value="spenders">Top Spenders</SelectItem>
                    <SelectItem value="expired">Expired Subscribers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  Message
                </Label>
                <Textarea id="message" className="col-span-3" placeholder="Hey! Check this out..." />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  PPV Price ($)
                </Label>
                <Input id="price" type="number" className="col-span-3" placeholder="Optional" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="media" className="text-right">
                  Media
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach File
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Send Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Target List</TableHead>
              <TableHead>Message Preview</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>{campaign.date}</TableCell>
                <TableCell>{campaign.creator}</TableCell>
                <TableCell>{campaign.target}</TableCell>
                <TableCell className="max-w-[200px] truncate">{campaign.message}</TableCell>
                <TableCell>{campaign.delivered}</TableCell>
                <TableCell>{campaign.revenue}</TableCell>
                <TableCell>
                  <Badge variant={campaign.status === "Completed" ? "default" : campaign.status === "Sent" ? "secondary" : "outline"}>
                    {campaign.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

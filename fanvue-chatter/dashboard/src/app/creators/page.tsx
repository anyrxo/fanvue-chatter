import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"

const creators = [
  {
    id: "1",
    name: "Alice Wonderland",
    status: "active",
    revenue: "$12,450",
    activeChats: 45,
    ppvSent: 120,
    conversion: "4.2%",
  },
  {
    id: "2",
    name: "Bella Thorne",
    status: "paused",
    revenue: "$8,200",
    activeChats: 12,
    ppvSent: 85,
    conversion: "3.8%",
  },
  {
    id: "3",
    name: "Cindy Star",
    status: "active",
    revenue: "$15,100",
    activeChats: 67,
    ppvSent: 150,
    conversion: "5.1%",
  },
]

export default function CreatorsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creators</h1>
          <p className="text-muted-foreground">Manage your AI personas and their performance.</p>
        </div>
        <Button asChild>
          <Link href="/api/auth/fanvue">
            <PlusCircle className="mr-2 h-4 w-4" />
            Connect Fanvue
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search creators..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Revenue (30d)</TableHead>
              <TableHead>Active Chats</TableHead>
              <TableHead>PPV Sent</TableHead>
              <TableHead>Conversion Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creators.map((creator) => (
              <TableRow key={creator.id}>
                <TableCell className="font-medium">
                  <Link href={`/creators/${creator.id}`} className="hover:underline">
                    {creator.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch checked={creator.status === "active"} />
                    <span className="text-sm text-muted-foreground capitalize">{creator.status}</span>
                  </div>
                </TableCell>
                <TableCell>{creator.revenue}</TableCell>
                <TableCell>{creator.activeChats}</TableCell>
                <TableCell>{creator.ppvSent}</TableCell>
                <TableCell>{creator.conversion}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/creators/${creator.id}`}>
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

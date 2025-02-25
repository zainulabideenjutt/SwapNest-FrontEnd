"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Report } from '@/lib/apiClient'

interface UserReportsProps {
  reports: Report[];
}

export function UserReports({ reports = [] }: UserReportsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not reviewed yet"
    return new Date(dateString).toLocaleString()
  }

  const getStatusVariant = (status: Report['status']): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "Approved":
        return "default"
      case "Rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">No reports found.</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <CardTitle className="text-lg">Report #{report.id}</CardTitle>
                  <Badge variant={getStatusVariant(report.status)} className="mt-1">
                    {report.status}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => toggleExpand(report.id)}>
                {expandedId === report.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {expandedId === report.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pb-4 px-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <p className="text-sm text-muted-foreground">Reason</p>
                      <p>{report.reason}</p>
                    </div>
                    <div className="grid gap-2">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p>{report.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Created At</p>
                        <p>{formatDate(report.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reviewed By</p>
                        <p>{report.reviewed_by || "Not reviewed yet"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reviewed At</p>
                        <p>{formatDate(report.reviewed_at)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  )
}


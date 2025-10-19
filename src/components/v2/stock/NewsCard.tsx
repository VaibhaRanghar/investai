import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Calendar, FileText, ExternalLink } from "lucide-react";
import { NewsCardProps, NewsItem } from "@/typesV2";

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  showAll = false,
}) => {
  const displayNews = showAll ? news : news.slice(0, 5);

  const getCategoryColor = (category: NewsItem["category"]) => {
    const colors = {
      Management: "warning",
      Dividend: "success",
      Results: "info",
      Compliance: "neutral",
      General: "neutral",
    };
    return colors[category] as "warning" | "success" | "info" | "neutral";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Latest Announcements</CardTitle>
          {!showAll && news.length > 5 && (
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All ({news.length})
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayNews.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant={getCategoryColor(item.category)} size="sm">
                  {item.category}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {item.date}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                {item.subject}
              </p>
              {item.hasAttachment && (
                <a
                  href={item.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <FileText className="w-3 h-3" />
                  <span>View Attachment</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const dummyNewsData: NewsCardProps = {
  news: [
    {
      date: "10-Oct-2025",
      subject:
        "Certificate under SEBI (Depositories and Participants) Regulations, 2018",
      category: "Compliance",
      hasAttachment: true,
      attachmentUrl: "#",
    },
    {
      date: "10-Oct-2025",
      subject: "General Updates - Board Meeting Outcome",
      category: "General",
    },
    {
      date: "01-Oct-2025",
      subject: "Change in Management - Appointment of New Director",
      category: "Management",
      hasAttachment: true,
      attachmentUrl: "#",
    },
    {
      date: "24-Sep-2025",
      subject: "Trading Window - Closure Period Announced",
      category: "Compliance",
    },
    {
      date: "22-Sep-2025",
      subject: "Change in Director(s) - Resignation Notice",
      category: "Management",
      hasAttachment: true,
      attachmentUrl: "#",
    },
    {
      date: "13-Aug-2025",
      subject: "Q1 FY2025 Results - Strong Revenue Growth",
      category: "Results",
      hasAttachment: true,
      attachmentUrl: "#",
    },
  ],
  showAll: false,
};

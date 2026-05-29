"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatJalaliDate } from "@/lib/dates/jalali";
import { formatNum } from "@/components/dashboard/format";
import { ExternalLink } from "@/lib/icons/app-icons";

interface CafeRow {
  _id: string;
  name: string;
  slug: string;
  city: string;
  phone: string;
  isOnboardingComplete: boolean;
  createdAt: string;
  ticketCount: number;
}

export default function AdminCafesList({ cafes }: { cafes: CafeRow[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام کافه</TableHead>
              <TableHead>شهر</TableHead>
              <TableHead>تلفن</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>تیکت‌ها</TableHead>
              <TableHead>تاریخ ثبت</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cafes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  کافه‌ای ثبت نشده است
                </TableCell>
              </TableRow>
            ) : (
              cafes.map((cafe) => (
                <TableRow key={cafe._id}>
                  <TableCell className="font-medium">{cafe.name}</TableCell>
                  <TableCell>{cafe.city}</TableCell>
                  <TableCell dir="ltr">{cafe.phone}</TableCell>
                  <TableCell>
                    <Badge variant={cafe.isOnboardingComplete ? "default" : "secondary"}>
                      {cafe.isOnboardingComplete ? "فعال" : "در حال راه‌اندازی"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatNum(cafe.ticketCount)}</TableCell>
                  <TableCell>{formatJalaliDate(cafe.createdAt)}</TableCell>
                  <TableCell>
                    <Link
                      href={`/${cafe.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      منو
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

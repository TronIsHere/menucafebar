"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import {
  customerStatusMessages,
  customerTrackingSteps,
  getTrackingStepIndex,
  type CustomerOrderView,
} from "@/lib/orders/customer-tracking";
import { formatToman, statusLabels, timeAgo } from "@/lib/orders/lifecycle";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  ChefHat,
  Clock,
  Package,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

interface Props {
  cafeSlug: string;
  cafeName: string;
  initialOrder: CustomerOrderView;
}

const stepIcons = [Clock, ChefHat, Package, Check];

export default function OrderTrackingClient({ cafeSlug, cafeName, initialOrder }: Props) {
  const { order, connected } = useOrderTracking(initialOrder._id, cafeSlug, initialOrder);
  const currentStep = getTrackingStepIndex(order.status);
  const isCancelled = order.status === "cancelled";
  const isComplete = order.status === "completed";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Link href={`/${cafeSlug}`} className="text-gray-600">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-lg leading-tight">پیگیری سفارش</h1>
              <p className="text-xs text-muted-foreground">{cafeName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {connected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-700">زنده</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>در حال اتصال...</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4 pb-8">
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">شماره سفارش</p>
              <p className="font-mono font-bold text-lg tracking-wider">
                {order._id.slice(-8).toUpperCase()}
              </p>
              {order.tableNumber && (
                <Badge variant="outline">میز {order.tableNumber}</Badge>
              )}
            </div>

            <div
              className={cn(
                "rounded-xl p-4 text-center",
                isCancelled && "bg-red-50 border border-red-200",
                isComplete && "bg-green-50 border border-green-200",
                !isCancelled && !isComplete && "bg-blue-50 border border-blue-200"
              )}
            >
              <p
                className={cn(
                  "font-semibold text-base",
                  isCancelled && "text-red-800",
                  isComplete && "text-green-800",
                  !isCancelled && !isComplete && "text-blue-800"
                )}
              >
                {statusLabels[order.status]}
              </p>
              <p className="text-sm mt-1 text-muted-foreground">
                {customerStatusMessages[order.status]}
              </p>
              <p className="text-xs mt-2 text-muted-foreground">
                آخرین به‌روزرسانی: {timeAgo(order.updatedAt)}
              </p>
            </div>

            {!isCancelled && (
              <div className="space-y-3">
                <div className="flex justify-between relative">
                  <div className="absolute top-4 inset-x-4 h-0.5 bg-gray-200 -z-0" />
                  <div
                    className="absolute top-4 right-4 h-0.5 bg-green-500 transition-all duration-500 -z-0"
                    style={{
                      width:
                        currentStep <= 0
                          ? "0%"
                          : `${Math.min((currentStep / (customerTrackingSteps.length - 1)) * 100, 100)}%`,
                      maxWidth: "calc(100% - 2rem)",
                    }}
                  />
                  {customerTrackingSteps.map((step, index) => {
                    const Icon = stepIcons[index];
                    const done = currentStep > index;
                    const active = currentStep === index;

                    return (
                      <div
                        key={step.status}
                        className="flex flex-col items-center gap-1.5 z-10 flex-1"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                            done && "bg-green-500 border-green-500 text-white",
                            active && "bg-blue-500 border-blue-500 text-white",
                            !done && !active && "bg-white border-gray-200 text-gray-400"
                          )}
                        >
                          {done ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] text-center leading-tight",
                            (done || active) && "font-medium text-gray-900",
                            !done && !active && "text-gray-400"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">جزئیات سفارش</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item, index) => (
              <div key={`${item.name}-${index}`} className="flex justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.note && (
                    <p className="text-xs text-muted-foreground">{item.note}</p>
                  )}
                </div>
                <span className="text-sm text-muted-foreground shrink-0">
                  × {item.quantity}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>جمع کل</span>
              <span>{formatToman(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        <Link href={`/${cafeSlug}`}>
          <Button variant="outline" className="w-full">
            سفارش جدید
          </Button>
        </Link>
      </div>
    </div>
  );
}

import React from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              الصفحة غير موجودة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  العودة للرئيسية
                </Link>
              </Button>
              <Button asChild>
                <Link to="/">
                  <Home className="h-4 w-4 ml-2" />
                  الصفحة الرئيسية
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

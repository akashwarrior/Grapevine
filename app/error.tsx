"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to an error reporting service
  console.error("Error boundary caught:", error);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-medium">Something went wrong!</h2>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. Please try again.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            Try Again
          </Button>
          <Button
            variant="outline"
            render={
              <a href="/">
                Go Home
              </a>
            }
          />
        </div>
      </div>
    </div>
  );
}


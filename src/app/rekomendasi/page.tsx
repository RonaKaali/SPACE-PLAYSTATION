import { Lightbulb } from "lucide-react";
import { RecommendationClient } from "./recommendation-client";

export default function RekomendasiPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="space-y-6 text-center">
        <div className="inline-block rounded-full bg-accent/20 p-3 text-accent">
          <Lightbulb className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Rekomendasi Game Personal
        </h1>
        <p className="text-lg text-muted-foreground">
          Bingung mau main apa? Biarkan AI kami membantumu! Beri tahu kami game yang kamu sukai, dan kami akan memberikan rekomendasi yang dibuat khusus untukmu.
        </p>
      </div>

      <div className="my-12">
        <RecommendationClient />
      </div>
    </div>
  );
}

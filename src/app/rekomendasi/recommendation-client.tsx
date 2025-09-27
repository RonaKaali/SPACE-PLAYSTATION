"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { Bot, Loader, Send, Sparkles } from "lucide-react";

import { getRecommendations } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  message: "",
  errors: undefined,
  recommendations: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      Dapatkan Rekomendasi
    </Button>
  );
}

export function RecommendationClient() {
  const [state, formAction] = useFormState(getRecommendations, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message !== "success" && state.message !== "") {
        const errorMessage = state.errors 
            ? Object.values(state.errors).flat().join(' ') 
            : state.message;

        toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
        });
    }
  }, [state, toast]);

  return (
    <Card className="max-w-3xl mx-auto border-primary/50 shadow-lg shadow-primary/10">
      <CardHeader>
        <CardTitle>Generator Rekomendasi</CardTitle>
        <CardDescription>
          Isi formulir di bawah ini untuk mendapatkan rekomendasi game dari AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rentalHistory">Riwayat Rental / Game yang Pernah Dimainkan</Label>
            <Textarea
              id="rentalHistory"
              name="rentalHistory"
              placeholder="Contoh: FIFA 22, God of War, The Last of Us Part II, Uncharted 4..."
              rows={4}
              className="bg-muted/50"
            />
            {state.errors?.rentalHistory && (
              <p className="text-sm text-destructive">{state.errors.rentalHistory}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gamePreferences">Preferensi Genre atau Tipe Game</Label>
            <Textarea
              id="gamePreferences"
              name="gamePreferences"
              placeholder="Contoh: Saya suka game open-world dengan cerita yang bagus, game balapan, atau game strategi."
              rows={4}
              className="bg-muted/50"
            />
            {state.errors?.gamePreferences && (
                <p className="text-sm text-destructive">{state.errors.gamePreferences}</p>
            )}
          </div>
          <SubmitButton />
        </form>

        {state.recommendations && (
            <div className="mt-8 pt-6 border-t">
                <h3 className="text-2xl font-headline font-semibold flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-accent" /> Rekomendasi Untukmu
                </h3>
                <div className="prose prose-invert prose-p:text-muted-foreground prose-li:text-muted-foreground rounded-lg bg-muted/50 p-4">
                    {state.recommendations.split('\n').map((line, index) => {
                        const isListItem = /^\d+\./.test(line.trim());
                        if (isListItem) {
                            return <p key={index} className="!m-0 !p-0">{line}</p>;
                        }
                        return <p key={index} className="!m-0 !p-0">{line}</p>;
                    })}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

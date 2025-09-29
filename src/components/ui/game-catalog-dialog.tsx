
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./button";

const gameList = {
  ps4: [
    'PES 2021 UPDATE PATCH 2025',
    'EA SPORT FC 25',
    'GOD OF WAR RAGNAROK',
    'IT TAKES TWO',
    'MOTOGP 24',
    'GTA V',
    'GHOST OF THUSIMA',
    'CALL OF DUTY',
    'NARUTO NINJA STORM 4',
    'TEKKEN 7',
    'CTR',
    'RESIDENT EVIL 4',
    'NBA 2K24',
    'ASSASIN CREED VALHALA',
    'MINECRAFT',
    'RED DEAD REDEMPTION II',
    'WWE 2K23',
    'MORTAL KOMBAT ULTIMATE',
    'SPIDERMAN',
  ],
  ps5: [ // Placeholder list for PS5, can be updated later
    'ASTRO\'s PLAYROOM',
    'EA SPORT FC 25',
    'GOD OF WAR RAGNAROK',
    'GTA V',
    'GHOST OF THUSIMA',
    'CALL OF DUTY',
    'NBA 2K24',
    'RED DEAD REDEMPTION II',
    'SPIDER-MAN: MILES MORALES',
    'HOGWARTS LEGACY',
    'ELDEN RING',
    'FINAL FANTASY XVI',
    'DEMON\'S SOULS',
    'RATCHET & CLANK: RIFT APART',
  ],
};

interface GameCatalogDialogProps {
    consoleType: 'ps4' | 'ps5';
}

export function GameCatalogDialog({ consoleType }: GameCatalogDialogProps) {
    const games = gameList[consoleType];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="w-full">Lihat Katalog Game</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-secondary">
                <DialogHeader>
                    <DialogTitle>Katalog Game - {consoleType.toUpperCase()}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                       {games.map((game, index) => (
                           <li key={index} className="text-base">{game}</li>
                       ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
}

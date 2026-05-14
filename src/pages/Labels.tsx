import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, Printer } from "lucide-react";
import { generateLabelsPDF } from "@/lib/pdf-generator";

export default function Labels() {
  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(10);
  const [customPhrase, setCustomPhrase] = useState("Pertence à Sorte Para Todos");
  const [numberFormat, setNumberFormat] = useState(5); // Número de dígitos
  
  // Função para formatar o número com zeros à esquerda
  const formatNumber = (num: number): string => {
    return `Nº ${num.toString().padStart(numberFormat, '0')}`;
  };
  
  const handleGenerateLabels = () => {
    if (startNumber > endNumber) {
      return;
    }
    
    generateLabelsPDF(startNumber, endNumber, customPhrase, numberFormat);
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Geração de Etiquetas</CardTitle>
          <CardDescription>
            Crie etiquetas com intervalos numéricos e frases personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startNumber">Número Inicial</Label>
              <Input
                id="startNumber"
                type="number"
                min={1}
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endNumber">Número Final</Label>
              <Input
                id="endNumber"
                type="number"
                min={startNumber}
                value={endNumber}
                onChange={(e) => setEndNumber(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberFormat">Formato do Número (dígitos)</Label>
              <Input
                id="numberFormat"
                type="number"
                min={1}
                max={10}
                value={numberFormat}
                onChange={(e) => setNumberFormat(parseInt(e.target.value) || 5)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customPhrase">Frase Personalizada</Label>
              <Input
                id="customPhrase"
                value={customPhrase}
                onChange={(e) => setCustomPhrase(e.target.value)}
                placeholder="Pertence à Sorte Para Todos"
              />
            </div>
          </div>
          
          {/* Área de Visualização */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4" /> Pré-visualização
            </h3>
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: Math.min(4, endNumber - startNumber + 1) }, (_, i) => (
                <div
                  key={i}
                  className="w-28 h-16 flex flex-col justify-center items-center p-2 text-center bg-white"
                >
                  <span className="text-lg font-bold">{formatNumber(startNumber + i)}</span>
                  <span className="text-xs mt-[-2px] truncate w-full">{customPhrase}</span>
                </div>
              ))}
              {endNumber - startNumber + 1 > 4 && (
                <div className="w-28 h-16 flex flex-col justify-center items-center bg-muted text-muted-foreground">
                  <span className="text-sm">+ {endNumber - startNumber - 3}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleGenerateLabels}
            className="flex items-center gap-2"
            disabled={startNumber > endNumber}
          >
            <Printer className="h-4 w-4" /> Gerar Etiquetas
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

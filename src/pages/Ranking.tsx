import { useApp } from "@/context/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemCategory } from "@/types";

const itemCategories: ItemCategory[] = [
  "Máquinas VX",
  "Máquinas Digital",
  "Notebook/PC",
  "Suprimentos",
  "Material de Escritório",
  "Bancadas",
  "Chips",
];

interface ResponsibleRanking {
  name: string;
  totalItems: number;
  byCategory: Record<ItemCategory, number>;
}

export default function Ranking() {
  const { movements, items } = useApp();

  // Calcula o ranking dos responsáveis
  const calculateRanking = (): ResponsibleRanking[] => {
    const rankingMap: Record<string, ResponsibleRanking> = {};

    // Filtrar apenas saídas (checkout)
    const checkoutMovements = movements.filter(m => m.type === 'checkout');

    checkoutMovements.forEach(movement => {
      const responsibleName = movement.responsibleName;

      if (!rankingMap[responsibleName]) {
        rankingMap[responsibleName] = {
          name: responsibleName,
          totalItems: 0,
          byCategory: itemCategories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {} as Record<ItemCategory, number>)
        };
      }

      movement.items.forEach(movementItem => {
        // Encontra o item original para pegar a categoria
        const item = items.find(i => i.id === movementItem.itemId);
        if (item) {
          rankingMap[responsibleName].totalItems += movementItem.quantity;
          if (item.category in rankingMap[responsibleName].byCategory) {
            rankingMap[responsibleName].byCategory[item.category] += movementItem.quantity;
          }
        }
      });
    });

    // Converte para array e ordena por total de itens (decrescente)
    return Object.values(rankingMap).sort((a, b) => b.totalItems - a.totalItems);
  };

  const ranking = calculateRanking();

  return (
    <div className="animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Responsáveis</CardTitle>
          <CardDescription>
            Responsáveis que mais retiraram máquinas e itens, ordenados por quantidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-50 shadow-sm">
                <TableRow>
                  <TableHead className="bg-white border-b">Posição</TableHead>
                  <TableHead className="bg-white border-b">Responsável</TableHead>
                  <TableHead className="bg-white border-b text-center">Total</TableHead>
                  {itemCategories.map(category => (
                    <TableHead key={category} className="bg-white border-b text-center">
                      {category}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.length > 0 ? (
                  ranking.map((responsible, index) => (
                    <TableRow key={responsible.name}>
                      <TableCell className="font-medium">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}º`}
                      </TableCell>
                      <TableCell className="font-medium">{responsible.name}</TableCell>
                      <TableCell className="text-center font-bold">{responsible.totalItems}</TableCell>
                      {itemCategories.map(category => (
                        <TableCell key={category} className="text-center">
                          {responsible.byCategory[category] > 0 ? responsible.byCategory[category] : "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2 + itemCategories.length} className="text-center py-6">
                      Nenhuma saída registrada ainda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

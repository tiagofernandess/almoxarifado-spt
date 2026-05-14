
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ItemCategory } from "@/types";

interface CategoryStat {
  category: ItemCategory;
  quantity: number;
}

interface CategoryTableProps {
  stats: CategoryStat[];
  totalItems: number;
}

export function CategoryTable({ stats, totalItems }: CategoryTableProps) {
  return (
    <Card className="card-transition">
      <CardHeader>
        <CardTitle>Status por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead className="w-[120px]">Qtde</TableHead>
              <TableHead className="hidden sm:table-cell">Distribuição</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => {
              const percentage = totalItems > 0 
                ? Math.round((stat.quantity / totalItems) * 100) 
                : 0;
              
              return (
                <TableRow key={stat.category}>
                  <TableCell>{stat.category}</TableCell>
                  <TableCell>{stat.quantity}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Progress value={percentage} className="h-2" />
                  </TableCell>
                  <TableCell className="text-right">{percentage}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

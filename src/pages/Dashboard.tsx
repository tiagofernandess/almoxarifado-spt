
import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { CategoryTable } from "@/components/Dashboard/CategoryTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ClipboardList, RefreshCw, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApp } from "@/context/AppContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { generateDashboardReportPDF } from "@/lib/pdf-generator";
import { ItemCategory } from "@/types";

export default function Dashboard() {
  const { items, sellers, movements, stats } = useApp();
  
  const categoryStats = Object.entries(stats.stockByCategory).map(([category, quantity]) => ({
    category: category as ItemCategory,
    quantity: quantity as number,
  }));
  
  // Últimas 5 movimentações
  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const handleGenerateReport = () => {
    generateDashboardReportPDF(stats, items, sellers, movements);
  };
  
  return (
    <Layout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Itens"
            value={stats.totalItems}
            icon={Package}
            description="Total de itens cadastrados"
          />
          <StatsCard
            title="Vendedores"
            value={stats.totalSellers}
            icon={Users}
            description="Total de vendedores"
          />
          <StatsCard
            title="Saídas"
            value={stats.totalCheckouts}
            icon={ClipboardList}
            description="Total de saídas registradas"
          />
          <StatsCard
            title="Devoluções"
            value={stats.totalReturns}
            icon={RefreshCw}
            description="Total de devoluções"
          />
        </div>

        {/* Status por categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryTable
            stats={categoryStats}
            totalItems={items.reduce((acc, item) => acc + item.availableQuantity, 0)}
          />

          {/* Últimas movimentações */}
          <Card className="card-transition">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Últimas Movimentações</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex gap-2 items-center"
                onClick={handleGenerateReport}
              >
                <Download className="h-4 w-4" /> Gerar Relatório
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Itens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMovements.length > 0 ? (
                    recentMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          {format(new Date(movement.date), "dd/MM/yy HH:mm", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              movement.type === "checkout"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {movement.type === "checkout" ? "Saída" : "Devolução"}
                          </span>
                        </TableCell>
                        <TableCell>{movement.responsibleName}</TableCell>
                        <TableCell className="text-right">
                          {movement.items.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Nenhuma movimentação registrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

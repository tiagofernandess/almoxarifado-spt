import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { CategoryTable } from "@/components/Dashboard/CategoryTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ClipboardList, RefreshCw, Download } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { generateDashboardReportPDF } from "@/lib/pdf-generator";
import { ItemCategory } from "@/types";

export default function Dashboard() {
  const { items, sellers, movements, stats } = useApp();
  
  const categoryStats = Object.entries(stats.stockByCategory).map(([category, quantity]) => {
    // Calcular quantidades por categoria
    const categoryItems = items.filter(item => item.category === category);
    const totalInCategory = categoryItems.length;
    const inUseCount = categoryItems.reduce((acc, item) => acc + item.inUseQuantity, 0);
    const availableCount = categoryItems.reduce((acc, item) => acc + item.availableQuantity, 0);
    
    return {
      category: category as ItemCategory,
      quantity: quantity as number,
      totalItems: totalInCategory,
      inUseQuantity: inUseCount,
      availableQuantity: availableCount
    };
  });
  
  const handleGenerateReport = () => {
    generateDashboardReportPDF(stats, items, sellers, movements);
  };
  
  return (
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
          title="Responsáveis"
          value={stats.totalSellers}
          icon={Users}
          description="Total de responsáveis"
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

      {/* Status por categoria - Versão Expandida */}
      <Card className="card-transition">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Status por Categoria</CardTitle>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Categoria</th>
                  <th className="text-center py-3 px-4">Qtde. Cadastrada</th>
                  <th className="text-center py-3 px-4">Em Uso</th>
                  <th className="text-center py-3 px-4">Disponível</th>
                  <th className="text-center py-3 px-4">% Utilização</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((stat) => {
                  const totalItems = stat.inUseQuantity + stat.availableQuantity;
                  const utilizationPercentage = totalItems > 0 
                    ? Math.round((stat.inUseQuantity / totalItems) * 100) 
                    : 0;
                  
                  return (
                    <tr key={stat.category} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{stat.category}</td>
                      <td className="text-center py-3 px-4">{stat.totalItems}</td>
                      <td className="text-center py-3 px-4">{stat.inUseQuantity}</td>
                      <td className="text-center py-3 px-4">{stat.availableQuantity}</td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center">
                          <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-sorte-primary h-2.5 rounded-full" 
                              style={{ width: `${utilizationPercentage}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs">{utilizationPercentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

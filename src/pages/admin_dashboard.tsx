import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, TrendingDown, Package, Utensils, 
  ArrowLeft, Plus, Trash2, AlertTriangle, 
  BarChart3, PieChart as PieChartIcon, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/context/admin_context";
import { useOrders } from "@/context/orders_context";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { 
    expenses, inventory, addExpense, removeExpense, totalExpenses, 
    updateInventoryStock, addInventoryItem, removeInventoryItem,
    setInventoryStock
  } = useAdmin();
  const { orders, dailyTotal } = useOrders();
  
  // States for Expenses
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  // States for Inventory
  const [itemName, setItemName] = useState("");
  const [itemStock, setItemStock] = useState("");
  const [itemMinStock, setItemMinStock] = useState("");
  const [itemUnit, setItemUnit] = useState("Pzs");

  const netProfit = dailyTotal - totalExpenses;

  // Data for Charts
  const salesByType = [
    { name: 'Local', value: orders.filter(o => o.orderType === 'local').length },
    { name: 'Llevar', value: orders.filter(o => o.orderType === 'para-llevar').length },
    { name: 'Plataformas', value: orders.filter(o => o.orderType === 'plataformas').length },
  ].filter(d => d.value > 0);

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6'];

  const handleAddExpense = async () => {
    if (!expenseDesc || !expenseAmount) return;
    await addExpense({
      description: expenseDesc,
      amount: parseFloat(expenseAmount),
      category: "General"
    });
    setExpenseDesc("");
    setExpenseAmount("");
  };

  const handleAddInventoryItem = async () => {
    if (!itemName || !itemStock || !itemMinStock) {
      toast.error("Por favor llena todos los campos del ítem");
      return;
    }
    await addInventoryItem({
      name: itemName,
      stock: parseInt(itemStock),
      minStock: parseInt(itemMinStock),
      unit: itemUnit
    });
    setItemName("");
    setItemStock("");
    setItemMinStock("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-200 p-4 md:p-8 selection:bg-primary selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/")}
              className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-400"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
                Super<span className="text-primary italic">User</span>
              </h1>
              <p className="text-zinc-500 font-medium text-sm">Panel de Control Maestro — Mr. Burger</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
               <div className="bg-emerald-500/10 p-3 rounded-xl">
                 <TrendingUp className="h-6 w-6 text-emerald-500" />
               </div>
               <div>
                 <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Ingresos Hoy</p>
                 <p className="text-2xl font-black text-white">${dailyTotal.toFixed(2)}</p>
               </div>
             </div>
             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
               <div className="bg-red-500/10 p-3 rounded-xl">
                 <TrendingDown className="h-6 w-6 text-red-500" />
               </div>
               <div>
                 <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Gastos Hoy</p>
                 <p className="text-2xl font-black text-white">${totalExpenses.toFixed(2)}</p>
               </div>
             </div>
          </div>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl">
            <TabsTrigger value="stats" className="font-bold uppercase text-[10px] gap-2 py-3 rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-primary transition-all">
              <BarChart3 className="h-4 w-4" /> Estadísticas
            </TabsTrigger>
            <TabsTrigger value="expenses" className="font-bold uppercase text-[10px] gap-2 py-3 rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-primary transition-all">
              <TrendingDown className="h-4 w-4" /> Gastos
            </TabsTrigger>
            <TabsTrigger value="inventory" className="font-bold uppercase text-[10px] gap-2 py-3 rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-primary transition-all">
              <Package className="h-4 w-4" /> Inventario
            </TabsTrigger>
            <TabsTrigger value="menu" className="font-bold uppercase text-[10px] gap-2 py-3 rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-primary transition-all">
              <Utensils className="h-4 w-4" /> Gestión Menú
            </TabsTrigger>
          </TabsList>

          {/* Estadísticas */}
          <TabsContent value="stats" className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <BarChart3 size={80} />
                </div>
                <CardHeader><CardTitle className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Estado Financiero</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-zinc-950 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-400">Total Ventas</span>
                      <span className="font-black text-emerald-500">+${dailyTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-400">Total Gastos</span>
                      <span className="font-black text-red-500">-${totalExpenses.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Ganancia Neta</p>
                    <p className={`text-5xl font-black tracking-tighter ${netProfit >= 0 ? 'text-primary' : 'text-red-500'}`}>
                      ${netProfit.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 bg-zinc-900 border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xs font-bold uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-primary" /> Canales de Venta
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  {salesByType.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesByType}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {salesByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
                      <History size={40} className="opacity-20" />
                      <p className="text-sm italic font-medium">No hay actividad registrada el día de hoy</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gastos */}
          <TabsContent value="expenses" className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardHeader><CardTitle className="text-lg font-black uppercase text-white">Nuevo Reporte de Gasto</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="Descripción (ej. Compra de Verdura)" 
                    className="flex-1 bg-zinc-950 border-zinc-800 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-zinc-700 font-medium"
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">$</span>
                    <input 
                      type="number" 
                      placeholder="Monto" 
                      className="w-full md:w-36 bg-zinc-950 border-zinc-800 text-white pl-8 pr-4 py-3 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-zinc-700 font-black"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddExpense} className="font-black rounded-2xl h-auto py-3 px-10 shadow-lg shadow-primary/20">
                    GUARDAR GASTO
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
              <CardHeader className="bg-zinc-950/50 border-b border-zinc-800"><CardTitle className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Desglose de Egresos — Hoy</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto text-white">
                   <table className="w-full text-left">
                     <thead className="bg-zinc-950/30 text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-800">
                       <tr>
                         <th className="px-8 py-4">Concepto / Descripción</th>
                         <th className="px-8 py-4">Hora</th>
                         <th className="px-8 py-4 text-right">Cantidad</th>
                         <th className="px-8 py-4 text-center">Acciones</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-800">
                       {expenses.length === 0 ? (
                         <tr><td colSpan={4} className="px-8 py-16 text-center text-zinc-600 italic font-medium">No se han registrado egresos el día de hoy</td></tr>
                       ) : (
                         expenses.map(e => (
                           <tr key={e.id} className="hover:bg-zinc-800/20 transition-all group">
                             <td className="px-8 py-5 font-bold text-zinc-300">{e.description}</td>
                             <td className="px-8 py-5 text-xs text-zinc-500 font-mono">{e.timestamp.toLocaleTimeString()}</td>
                             <td className="px-8 py-5 text-right font-black text-red-500 text-lg">-${e.amount.toFixed(2)}</td>
                             <td className="px-8 py-5 text-center">
                               <button 
                                onClick={() => removeExpense(e.id)} 
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-600 hover:bg-red-500/10 hover:text-red-500 transition-all mx-auto"
                               >
                                 <Trash2 size={18} />
                               </button>
                             </td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventario */}
          <TabsContent value="inventory" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <CardHeader><CardTitle className="text-lg font-black uppercase text-white">Registrar Nuevo Insumo</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nombre (ej. Pan Hamburguesa)" 
                    className="md:col-span-2 bg-zinc-950 border-zinc-800 text-white px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-zinc-700 font-medium"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Stock Inicial" 
                    className="bg-zinc-950 border-zinc-800 text-white px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-zinc-700 font-black"
                    value={itemStock}
                    onChange={(e) => setItemStock(e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Min. Alerta" 
                    className="bg-zinc-950 border-zinc-800 text-white px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-zinc-700 font-black text-orange-500"
                    value={itemMinStock}
                    onChange={(e) => setItemMinStock(e.target.value)}
                  />
                  <select 
                    className="bg-zinc-950 border-zinc-800 text-white px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                  >
                    <option value="Pzs">Piezas (Pzs)</option>
                    <option value="Kg">Kilos (Kg)</option>
                    <option value="Gr">Gramos (Gr)</option>
                    <option value="Lt">Litros (Lt)</option>
                    <option value="Paq">Paquetes (Paq)</option>
                  </select>
                  <Button onClick={handleAddInventoryItem} className="md:col-span-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/10">
                    <Plus className="mr-2 h-5 w-5" /> AÑADIR AL INVENTARIO
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-zinc-950/50 border-b border-zinc-800">
                <CardTitle className="text-sm font-bold uppercase text-zinc-500 tracking-widest">Insumos en almacén</CardTitle>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-500 bg-orange-500/10 px-4 py-1.5 rounded-full ring-1 ring-orange-500/30">
                  <AlertTriangle size={14} className="animate-pulse" /> Revisión de Niveles
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                  {inventory.length === 0 ? (
                     <div className="col-span-full text-center py-20 space-y-4">
                        <Package size={60} className="mx-auto text-zinc-800" />
                        <p className="text-zinc-600 italic font-medium">La base de datos de inventario está vacía.</p>
                     </div>
                  ) : (
                    inventory.map(item => {
                      const isMainMeat = item.id === "main_patties";
                      
                      return (
                        <Card key={item.id} className={`bg-zinc-950 border-zinc-800 transition-all duration-300 relative group ${item.stock <= item.minStock ? 'ring-2 ring-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'hover:border-zinc-700'}`}>
                          {!isMainMeat && (
                            <button 
                              onClick={() => removeInventoryItem(item.id)}
                              className="absolute top-2 right-2 p-2 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <CardContent className="p-6 space-y-6">
                            <div className="flex justify-between items-start mr-6">
                              <div>
                                 <p className="font-black text-xl text-white tracking-tight">{item.name}</p>
                                 <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mt-1 block">Unidad: {item.unit}</span>
                              </div>
                              {item.stock <= item.minStock && (
                                 <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500 h-fit" title="¡Stock Crítico!">
                                   <AlertTriangle size={18} />
                                 </div>
                              )}
                            </div>
                            
                            <div className="flex items-end justify-between">
                               <div className="space-y-1">
                                 <div className="flex items-baseline gap-2">
                                     <input 
                                       type="number"
                                       className={cn(
                                         "bg-transparent border-none p-0 w-24 text-5xl font-black tabular-nums transition-colors focus:ring-0 outline-none",
                                         item.stock <= item.minStock ? 'text-orange-500' : 'text-primary'
                                       )}
                                       value={item.stock}
                                       onChange={(e) => setInventoryStock(item.id, parseInt(e.target.value) || 0)}
                                     />
                                 </div>
                                 <p className="text-[9px] uppercase font-black text-zinc-600 tracking-wider">Existencia Actual</p>
                               </div>
                               
                               <div className="flex gap-2 p-1.5 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-inner">
                                 <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-10 w-10 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-xl active:scale-90 transition-all font-black text-xl" 
                                  onClick={() => updateInventoryStock(item.id, -1)}
                                 >-</Button>
                                 <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-10 w-10 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-xl active:scale-90 transition-all font-black text-xl" 
                                  onClick={() => updateInventoryStock(item.id, 1)}
                                 >+</Button>
                               </div>
                            </div>

                            <div className="pt-2">
                               <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                                 <div 
                                  className={`h-full transition-all duration-1000 ${item.stock <= item.minStock ? 'bg-orange-500' : 'bg-primary'}`} 
                                  style={{ width: `${Math.min(100, (item.stock / (item.minStock * 4)) * 100)}%` }} 
                                 />
                               </div>
                               <p className="text-[9px] text-zinc-500 mt-2 font-bold uppercase">Meta de seguridad semanal: {item.minStock * 4} {item.unit}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    } )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestión Menú */}
          <TabsContent value="menu" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              <CardHeader className="text-center pt-12">
                 <CardTitle className="text-3xl font-black uppercase text-white tracking-tighter">Editor Dinámico Mr. Burger</CardTitle>
              </CardHeader>
              <CardContent className="pb-16 pt-4 flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
                 <div className="bg-zinc-950 p-10 rounded-3xl border border-zinc-800 shadow-2xl relative rotate-3 hover:rotate-0 transition-transform duration-500">
                   <Utensils className="h-16 w-16 text-primary animate-bounce-slow" />
                   <div className="absolute -top-3 -right-3 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">BETA</div>
                 </div>
                 <div className="space-y-3">
                   <h3 className="text-xl font-black uppercase text-white">¿Quieres cambiar el precio de una burguer?</h3>
                   <p className="text-zinc-500 leading-relaxed font-medium">
                     Estamos trabajando en un sistema que te permitirá modificar tus productos, precios y fotos en la nube sin necesidad de programadores. ¡Tú tendrás el control absoluto!
                   </p>
                 </div>
                 <div className="flex gap-4">
                    <Button disabled className="font-black h-14 px-12 rounded-2xl bg-zinc-800 text-zinc-500 border border-zinc-700">PRÓXIMAMENTE</Button>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


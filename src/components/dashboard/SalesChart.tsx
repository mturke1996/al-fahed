
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const data = [
  { month: 'يناير', sales: 15000, invoices: 52, growth: 8.5 },
  { month: 'فبراير', sales: 23000, invoices: 78, growth: 12.3 },
  { month: 'مارس', sales: 19000, invoices: 65, growth: 5.8 },
  { month: 'أبريل', sales: 28000, invoices: 94, growth: 18.2 },
  { month: 'مايو', sales: 24000, invoices: 82, growth: 11.7 },
  { month: 'يونيو', sales: 32000, invoices: 108, growth: 22.8 }
]

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-brand-dark">إحصائيات المبيعات</CardTitle>
        <CardDescription>
          تطور المبيعات وعدد الفواتير خلال الأشهر الستة الماضية
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              formatter={(value, name) => [
                `${value} ${name === 'sales' ? 'د.ل' : name === 'invoices' ? 'فاتورة' : '%'}`,
                name === 'sales' ? 'المبيعات' : name === 'invoices' ? 'عدد الفواتير' : 'النمو'
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="hsl(var(--brand))" name="المبيعات" radius={[4, 4, 0, 0]} />
            <Bar dataKey="invoices" fill="hsl(var(--brand-accent))" name="عدد الفواتير" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-medium text-brand-dark mb-3">معدل النمو الشهري</h4>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={data}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'معدل النمو']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="growth" 
                stroke="hsl(var(--brand-accent))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--brand-accent))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

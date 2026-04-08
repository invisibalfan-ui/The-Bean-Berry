import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"

export default function Dashboard() {
  const data = [
    { day: "Mon", sales: 120 },
    { day: "Tue", sales: 200 },
    { day: "Wed", sales: 150 },
    { day: "Thu", sales: 300 },
    { day: "Fri", sales: 250 }
  ]

  return (
    <div>
      <h2>Sales Dashboard</h2>

      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" />
      </LineChart>
    </div>
  )
}
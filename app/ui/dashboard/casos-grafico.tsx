'use client'
// import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { CasosData, YAxisLabels } from '@/app/lib/definitions';

interface CasosDataChartProps {
  casosData: CasosData[];
  
}

function generateYAxis(data: CasosData[]): YAxisLabels {
  const maxQuantidade = Math.max(...data.map(d => parseInt(d.quantidade_processos, 10)));
  const yAxisLabels = Array.from({ length: maxQuantidade + 1 }, (_, i) => i);
  return {
    yAxisLabels,
    topLabel: maxQuantidade
  };
}

const CasosDataChart: React.FC<CasosDataChartProps> = ({ casosData }) => {
  const chartHeight = 350;

  if (!casosData || casosData.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  const { yAxisLabels, topLabel } = generateYAxis(casosData);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Quantidade de Casos Recentes
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px`, 
            display: 'flex',
            flexDirection: 'column-reverse'
          }}
          >
            {yAxisLabels.map((label, index) => (
              <p key={index}>{label}</p>
              ))}
          </div>

          {casosData.map((month) => (
            <div key={`${month.ano}-${month.mes}`} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * parseInt(month.quantidade_processos, 10)}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {`${month.mes}/${month.ano}`}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Últimos 12 meses</h3>
        </div>
      </div>
    </div>
  );
}

export default CasosDataChart;

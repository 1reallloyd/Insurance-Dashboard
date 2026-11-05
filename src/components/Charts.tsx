import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  registerables,
  ChartData,
} from 'chart.js';

// Register all Chart.js controllers and components
ChartJS.register(...registerables);

interface DistributionProps {
  onCategoryClick?: (category: string) => void;
}

export const ClaimsDistributionChart: React.FC<DistributionProps> = ({ onCategoryClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const data: ChartData<'doughnut'> = {
      labels: ['Auto', 'Home', 'Health', 'Life', 'Business'],
      datasets: [
        {
          data: [35, 25, 20, 15, 5],
          backgroundColor: ['#00008b', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    };

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#00008b',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            padding: 10,
            cornerRadius: 8,
            titleFont: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
            bodyFont: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
            callbacks: {
              label: (context: any) => `  ${context.label}: ${context.parsed}% of losses`,
            },
          },
        },
        onClick: (_event: any, elements: any[]) => {
          if (elements.length > 0 && onCategoryClick) {
            const index = elements[0].index;
            const label = data.labels?.[index] as string;
            if (label) onCategoryClick(label);
          }
        },
      } as any,
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [onCategoryClick]);

  return (
    <div className="relative w-full h-56 sm:h-64 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl sm:text-2xl font-extrabold text-[#00008b] tracking-tight tabular-nums">
          3,490
        </span>
        <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
          Total Policies
        </span>
      </div>
    </div>
  );
};

interface TrendChartProps {
  labels: string[];
  data: number[];
  labelName: string;
}

export const ClaimsTrendChart: React.FC<TrendChartProps> = ({ labels, data, labelName }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const trendGradient = ctx.createLinearGradient(0, 0, 0, 240);
    trendGradient.addColorStop(0, 'rgba(0, 0, 139, 0.20)');
    trendGradient.addColorStop(0.7, 'rgba(0, 0, 139, 0.03)');
    trendGradient.addColorStop(1, 'rgba(0, 0, 139, 0.00)');

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: labelName,
            data,
            borderColor: '#00008b',
            backgroundColor: trendGradient,
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointBackgroundColor: '#00008b',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#00008b',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#00008b',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            padding: 10,
            cornerRadius: 8,
            titleFont: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
            bodyFont: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
            callbacks: {
              label: (context) => `  Volume: ${context.parsed.y} claims`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.04)',
            },
            ticks: {
              color: '#64748b',
              font: { size: 10.5, family: "'Plus Jakarta Sans', sans-serif" },
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748b',
              font: { size: 10.5, weight: 600, family: "'Plus Jakarta Sans', sans-serif" },
            },
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [labels, data, labelName]);

  return (
    <div className="relative w-full h-56 sm:h-64">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

interface ComparisonChartProps {
  labels: string[];
  actual: number[];
  predicted: number[];
}

export const ActualVsPredictedChart: React.FC<ComparisonChartProps> = ({
  labels,
  actual,
  predicted,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Actual Claims',
            data: actual,
            backgroundColor: '#00008b',
            borderRadius: 5,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.65,
          },
          {
            label: 'Predicted Claims',
            data: predicted,
            backgroundColor: '#3b82f6',
            borderRadius: 5,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.65,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#00008b',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            padding: 10,
            cornerRadius: 8,
            titleFont: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
            bodyFont: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.04)',
            },
            ticks: {
              color: '#64748b',
              font: { size: 10.5, family: "'Plus Jakarta Sans', sans-serif" },
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748b',
              font: { size: 10.5, weight: 500, family: "'Plus Jakarta Sans', sans-serif" },
            },
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [labels, actual, predicted]);

  return (
    <div className="relative w-full h-56 sm:h-64">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

import React, { useEffect, useRef } from 'react';

export default function ChartWidget({ title, data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxVal = Math.max(...data.map(d => d.revenue)) * 1.15;
    const barWidth = (chartWidth / data.length) * 0.55;
    const gap = chartWidth / data.length;

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = height - padding - (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`$${Math.round((maxVal / 4) * i / 1000)}k`, padding - 8, y + 4);
    }

    // Draw Bars
    data.forEach((item, index) => {
      const barH = (item.revenue / maxVal) * chartHeight;
      const x = padding + index * gap + (gap - barWidth) / 2;
      const y = height - padding - barH;

      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, '#4f46e5');
      gradient.addColorStop(1, '#818cf8');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Month Label
      ctx.fillStyle = '#475569';
      ctx.font = '600 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.month, x + barWidth / 2, height - padding + 20);
    });

  }, [data]);

  return (
    <div className="card">
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
        <span className="badge badge-info">Monthly Breakdown</span>
      </div>
      <canvas ref={canvasRef} width={600} height={260} style={{ width: '100%', height: 'auto' }} />
    </div>
  );
}

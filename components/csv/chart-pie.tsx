import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';


interface DataItem {
  key: string;
  value: number;
}

interface BarChartProps {
  data: DataItem[];
}

const ChartBar: React.FC<BarChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option = {
        color:['#04A4DE','#007BA8'],
        tooltip: {
          show: false
        },
        labelLine: {
          show: false // 不显示指引线
        },
        hoverAnimation: false,
        lengend: {
          show: false,
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '100%',
            data: data.map(item => ({
              name: item?.key,
              value: item?.value,
            })),
            label: {
              show: false,
              formatter: '{b}: {c} ({d}%)', // 显示每个扇区的名称、数值和百分比
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
            },
            emphasis: {
              itemStyle: {
                // 取消高亮样式，禁用变化
                color: 'inherit', // 保持原样
                shadowBlur: 0,    // 取消阴影
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
              scale: false,  // 禁用放大效果
            },
          },
        ],
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, [data]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
  );
};

export default ChartBar;
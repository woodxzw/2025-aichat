import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// 定义 data 数组中每个对象的类型
interface DataItem {
  label: string;
  count: number;
}

interface BarChartProps {
  data: DataItem[];
}

const ChartBar: React.FC<BarChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
          formatter: (params: echarts.TooltipComponentFormatterCallbackParams) => {
            // 返回 tooltip 内容
            if (Array.isArray(params) && params.length > 0) {
              const dataIndex = params[0].dataIndex;
              return `
                <div>
                  <p style="font-size:10px">${data[dataIndex]?.label}</p>
                  <p style="font-size:10px">Count: ${data[dataIndex]?.count}</p>
                </div>
              `;
            }
            return '';
          },
        },
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          containLabel: false,
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.label),  // 使用原数据的label作为x轴
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          show: false,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        series: [
          {
            data: data.map(item => item.count),
            type: 'bar',
            barWidth: 'auto',
            itemStyle: {
              color: '#007BA8',
            },
            barGap: 1, // 柱子之间的间隔为 0
            barCategoryGap: 0, // 柱子与分类之间的间隔为 0
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
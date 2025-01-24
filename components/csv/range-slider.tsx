import React, { useState, ChangeEvent, MouseEvent, useEffect } from 'react';
import s from "./range-slider.module.css";

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  disabled?: boolean;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  disabled = false,
}) => {
  const [startValue, setStartValue] = useState(value[0]);
  const [endValue, setEndValue] = useState(value[1]);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [draggingValue, setDraggingValue] = useState<number | null>(null);


  useEffect(() => {
    onChange([startValue, endValue]);
  }, [startValue, endValue]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, isStart: boolean, isTrackClick: boolean) => {
    if (disabled) return;

    // 如果是点击 track，则按点击位置更新对应的滑块
    if (isTrackClick) {
      const newValue = getValueFromMouseEvent(e);
      if (newValue < (startValue + endValue) / 2) {
        setDraggingValue(newValue);
        updateRangeValues(newValue, true); // 更新 startValue
        setIsDraggingStart(true);
        setIsDraggingEnd(false);
      } else {
        setDraggingValue(newValue);
        updateRangeValues(newValue, false); // 更新 endValue
        setIsDraggingStart(false);
        setIsDraggingEnd(true);
      }
      return;
    }

    // 如果是点击 thumb，则重置拖动状态
    if (isStart) {
      setIsDraggingStart(true);
      setIsDraggingEnd(false);
    } else {
      setIsDraggingStart(false);
      setIsDraggingEnd(true);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDraggingStart && !isDraggingEnd) return;
    const newValue = getValueFromMouseEvent(e);
    setDraggingValue(newValue);
    if (isDraggingStart) {
      updateRangeValues(newValue, true);
    } else if (isDraggingEnd) {
      updateRangeValues(newValue, false);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
    setDraggingValue(null);
  };

  const getValueFromMouseEvent = (e: MouseEvent<HTMLDivElement>): number => {
    const rangeWidth = e.currentTarget.clientWidth;
    const clickX = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const newValue = min + ((clickX / rangeWidth) * (max - min));
    return Math.round(newValue / step) * step;
  };

  const updateRangeValues = (newValue: number, isStart: boolean) => {
    if (isStart) {
      if (newValue <= endValue && newValue >= min) {
        setStartValue(newValue);
      }
    } else {
      if (newValue >= startValue && newValue <= max) {
        setEndValue(newValue);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const range = e.target.value.split(',').map(Number);
    const newStartValue = range[0];
    const newEndValue = range[1];
    if (!isNaN(newStartValue) && !isNaN(newEndValue) && newStartValue >= min && newEndValue <= max && newStartValue <= newEndValue) {
      setStartValue(newStartValue);
      setEndValue(newEndValue);
    }
  };

  const rangeValue = `${startValue},${endValue}`;

  // 计算范围区域的样式
  const rangeTrackStyle = {
    left: `${((startValue - min) / (max - min)) * 100}%`,
    width: `${((endValue - startValue) / (max - min)) * 100}%`,
  };

  return (
    <div
      className={s.range_slider}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <input
        type="range"
        value={rangeValue}
        min={min}
        max={max}
        step={step}
        onChange={handleInputChange}
        disabled={disabled}
        className={s.range_slider_input}
      />
      <div className={s.range_slider_track}>
        <div
          className={s.range_slider_range}
          style={rangeTrackStyle}
        ></div>
        <div
          className={s.range_slider_thumb_start}
          style={{ left: `${((startValue - min) / (max - min)) * 100}%` }}
          onMouseDown={(e) => {
            e.stopPropagation(); // 阻止事件冒泡
            handleMouseDown(e, true, false); // 点击 thumb 时传递 isTrackClick 为 false
          }}
        ></div>
        <div
          className={s.range_slider_thumb_end}
          style={{ left: `${((endValue - min) / (max - min)) * 100}%` }}
          onMouseDown={(e) => {
            e.stopPropagation(); // 阻止事件冒泡
            handleMouseDown(e, false, false); // 点击 thumb 时传递 isTrackClick 为 false
          }}
        ></div>
      </div>
      <div className='flex justify-between items-center mt-10 flex-1'>
        <div className='text-xs'>{startValue}</div>
        <div className='text-xs'>{endValue}</div>
      </div>
    </div>
  );
};

export default RangeSlider;
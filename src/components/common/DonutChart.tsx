import { h } from 'preact';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

interface DonutChartProps {
  segments: Array<{ value: number; color: string; label?: string }>;
  size?: number;
  strokeWidth?: number;
  centerValue?: string;
  centerLabel?: string;
  gapDegrees?: number;
  onClick?: () => void;
  trackColor?: 'card' | 'tab';
}

export function DonutChart({
  segments,
  size = 64,
  strokeWidth = 3,
  centerValue,
  centerLabel,
  gapDegrees = 0,
  onClick,
  trackColor = 'card',
}: DonutChartProps) {
  // Parse and animate percentage values
  const isPercentage = centerValue?.includes('%');
  const numericValue = isPercentage ? parseFloat(centerValue?.replace('%', '') || '0') : 0;
  const animatedValue = useAnimatedCounter(numericValue, 800);
  const displayValue = isPercentage ? `${animatedValue}%` : centerValue;

  // Chart dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate gap between segments
  const gapLength = (gapDegrees / 360) * circumference;

  // Calculate total value for percentage calculations
  const total = segments.reduce((sum, seg) => sum + (seg.value || 0), 0);

  // Generate progress arcs
  // Note: These use stroke-dasharray for animation-ready rendering
  let currentOffset = 0;
  const progressArcs = segments
    .filter((segment) => segment.value > 0) // Only render segments with positive values
    .map((segment, index) => {
      // Safety checks to prevent NaN
      const safeValue = segment.value || 0;
      const safeTotal = total || 1; // Prevent division by zero
      const percentage = safeValue / safeTotal;
      const strokeLength = Math.max(0, circumference * percentage - gapLength); // Ensure non-negative
      const offset = currentOffset;
      currentOffset += strokeLength + gapLength;

      return (
        <circle
          key={`progress-${index}`}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={segment.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${strokeLength} ${circumference}`}
          strokeDashoffset={-offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            ['--stroke-length' as any]: strokeLength,
            animation: 'donutFill 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            animationDelay: `${index * 0.1}s`,
          }}
        />
      );
    });

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        cursor: onClick ? 'help' : 'default',
      }}
      onClick={onClick}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        {/* Background track circle - adapts to theme */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          style={{
            stroke: trackColor === 'card' ? 'var(--track-bg-card)' : 'var(--track-bg-tab)',
            strokeWidth: `${strokeWidth}px`,
          }}
        />

        {/* Progress segments group - rendered on top */}
        <g>{progressArcs}</g>
      </svg>

      {/* Center value display */}
      {centerValue && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: '900',
              lineHeight: '1',
              fontFeatureSettings: '"tnum"',
              color: 'var(--text-primary)',
            }}
          >
            {displayValue}
          </div>
          {centerLabel && (
            <div
              style={{
                fontSize: '7px',
                marginTop: '2px',
                opacity: 0.6,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-primary)',
              }}
            >
              {centerLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

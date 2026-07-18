const ProgressBar = ({
  // Single progress
  value,
  max = 100,

  // Segmented progress
  segments,

  // Colors
  fillColor,
  trackColor,

  // Size
  height = "15px",
  radius = "15px",

  // Percentage
  showPercentage = true,
  percentageColor = "#171D1A",

  // Styling
  className = "",
  animate = true,
}) => {
  const isSegmented =
    Array.isArray(segments) && segments.length > 0;

  const percentage = Math.min(
    Math.max((value / max) * 100, 0),
    100
  );

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      {/* Track */}
      <div
        className="flex-1 overflow-hidden flex"
        style={{
          backgroundColor: trackColor,
          height,
          borderRadius: radius,
        }}
      >
        {isSegmented ? (
          segments.map((segment, index) => (
            <div
              key={index}
              className={animate ? "transition-all duration-500" : ""}
              style={{
                width: `${segment.value}%`,
                backgroundColor: segment.color,
                height: "100%",
              }}
            />
          ))
        ) : (
          <div
            className={animate ? "transition-all duration-500" : ""}
            style={{
              width: `${percentage}%`,
              height: "100%",
              backgroundColor: fillColor,
              borderRadius: radius,
            }}
          />
        )}
      </div>

      {/* Percentage */}
      {showPercentage && !isSegmented && (
        <span
          className="text-[16px] font-semibold whitespace-nowrap"
          style={{ color: percentageColor }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
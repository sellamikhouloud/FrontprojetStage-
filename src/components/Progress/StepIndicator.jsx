const StepIndicator = ({
  totalSteps = 3,
  currentStep = 1,
}) => {
  return (
    <div className="flex justify-center items-center gap-[12px]">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`
            w-[9.74px]
            h-[9.74px]
            rounded-full
            ${
              index + 1 === currentStep
                ? "bg-[#4E9F8A]"
                : "bg-[#A7CFC5]"
            }
          `}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
import { FiCheck } from "react-icons/fi";
import type { FormState } from "@appTypes/rfq";
import { FIELD_LABELS } from "@lib/rfqConstants";

interface RfqCompletenessProps {
  completionPercent: number;
  missingRequired: (keyof FormState)[];
  isComplete: boolean;
}

const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;

const RfqCompleteness = ({
  completionPercent,
  missingRequired,
  isComplete,
}: RfqCompletenessProps) => {
  const dashOffset = CIRC * (1 - completionPercent / 100);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 md:sticky md:top-24">

      <h3 className="text-sm font-semibold text-gray-900 text-center mb-5">
        Completeness
      </h3>

      {/* SVG ring */}
      <div className="flex justify-center mb-5">
        <div className="relative w-36 h-36">
          <svg width="144" height="144" viewBox="0 0 144 144" className="w-full h-full" style={{ filter: "drop-shadow(0 0 12px rgba(147,197,253,0.4))" }}>
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle cx="72" cy="72" r={RADIUS} fill="none" stroke="#e9eef4" strokeWidth="12" />
            {/* Progress */}
            <circle
              cx="72"
              cy="72"
              r={RADIUS}
              fill="none"
              stroke={isComplete ? "#22c55e" : "url(#ringGrad)"}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 72 72)"
              style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
            />
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-semibold ${isComplete ? "text-green-600" : "text-gray-600"}`}>
              {isComplete ? "Complete" : "Incomplete"}
            </span>
          </div>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-400 text-center leading-relaxed mb-4">
        The more precise information you write,<br />the better response you will get.
      </p>

      {/* Missing required fields */}
      {missingRequired.length > 0 && (
        <div className="px-1">
          <p className="text-xs font-semibold text-primary mb-2.5 leading-snug">
            Please fill in the required fields before submitting.
          </p>
          <ul className="space-y-1.5">
            {missingRequired.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {FIELD_LABELS[f]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* All complete */}
      {isComplete && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center justify-center gap-1.5">
          <FiCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
          <span className="text-xs font-semibold text-green-600">
            All required fields completed!
          </span>
        </div>
      )}

    </div>
  );
};

export default RfqCompleteness;
